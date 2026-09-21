import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UsersService } from '../../../core/data-access/users.service';

describe('UserListComponent', () => {
  let fixture: ComponentFixture<UserListComponent>;
  let service: UsersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
    }).compileComponents();

    service = TestBed.inject(UsersService);
    fixture = TestBed.createComponent(UserListComponent);
    fixture.detectChanges();
  });

  it('carrega lista inicial', fakeAsync(() => {
    tick(600);
    expect(fixture.componentInstance.users().length).toBeGreaterThan(0);
  }));

  it('aplica debounce de 300ms no filtro', fakeAsync(() => {
    const spy = vi.spyOn(service, 'list');
    fixture.componentInstance.filterCtrl.setValue('a');
    tick(200);
    expect(spy).not.toHaveBeenCalledWith('a');
    tick(200);
    expect(spy).toHaveBeenCalledWith('a');
  }));

  it('exibe mensagem de erro quando o serviço falha', fakeAsync(() => {
    vi.spyOn(service, 'list').mockReturnValue(
      new Observable(o => o.error('fail')) as any,
    );
    fixture.componentInstance.filterCtrl.setValue('x');
    tick(600);
    expect(fixture.componentInstance.error()).toBeTruthy();
  }));
});