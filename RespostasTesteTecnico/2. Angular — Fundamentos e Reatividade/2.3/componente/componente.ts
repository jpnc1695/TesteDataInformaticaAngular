import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { BuscaService, ResultadoBusca } from './busca.service';

interface BuscaState {
  carregando: boolean;
  resultados: ResultadoBusca[];
  erro: string | null;
}

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuscaComponent implements OnInit {
  readonly termoCtrl = new FormControl<string>('', { nonNullable: true });
  state$!: Observable<BuscaState>;

  constructor(private readonly buscaService: BuscaService) {}

  ngOnInit(): void {
    this.state$ = this.termoCtrl.valueChanges.pipe(
      // 1) Espera 500 ms de silêncio antes de prosseguir
      debounceTime(500),

      // 2) Ignora valores repetidos consecutivos
      distinctUntilChanged(),

      // 3) Normaliza e exige termo mínimo
      map(termo => termo.trim()),
      filter(termo => termo.length >= 2),

      // 4) Cancela a requisição anterior a cada novo termo
      switchMap(termo =>
        this.buscaService.buscar(termo).pipe(
          // 5) Emite o estado de loading antes da resposta
          startWith<BuscaState>({
            carregando: true,
            resultados: [],
            erro: null,
          }),

          // 6) Mapeia a resposta para o estado de sucesso
          map(resultados => ({
            carregando: false,
            resultados,
            erro: null,
          })),

          // 7) Trata erro sem quebrar o fluxo
          catchError(() =>
            of<BuscaState>({
              carregando: false,
              resultados: [],
              erro: 'Não foi possível buscar. Tente novamente.',
            })
          )
        )
      ),

      // 8) Estado inicial antes do usuário digitar
      startWith<BuscaState>({
        carregando: false,
        resultados: [],
        erro: null,
      })
    );
  }
}