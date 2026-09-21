import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UsersService] });
    service = TestBed.inject(UsersService);
  });

  it('lista todos os usuários sem filtro', async () => {
    const list = await firstValueFrom(service.list());
    expect(list.length).toBeGreaterThan(0);
  });

  it('filtra por nome (case-insensitive)', async () => {
    const list = await firstValueFrom(service.list('giana'));
    expect(list).toHaveLength(1);
    expect(list[0].name).toContain('Giana');
  });

  it('cria usuário com id gerado', async () => {
    const created = await firstValueFrom(service.create({
      name: 'Novo', email: 'n@e.com', cpf: '52998224725',
      phone: '11999999999', phoneType: 'mobile',
    }));
    expect(created.id).toBeTruthy();
    expect(service.users().some(u => u.id === created.id)).toBe(true);
  });

  it('atualiza usuário existente', async () => {
    const first = service.users()[0];
    const updated = await firstValueFrom(service.update(first.id, { ...first, name: 'Renomeado' }));
    expect(updated.name).toBe('Renomeado');
  });

  it('retorna erro ao atualizar usuário inexistente', async () => {
    await expect(firstValueFrom(service.update('x', {} as any))).rejects.toThrow();
  });
});