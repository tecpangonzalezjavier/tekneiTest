
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = ['name', 'address', 'postcode', 'email', 'actions'];
  editingUser: User | null = null;
  editForm: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      first: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      last: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      state: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      country: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      postcode: [
        '',
        [
          Validators.required,
          Validators.pattern('(^[A-Za-z0-9]{3} ?[A-Za-z0-9]{3}$)|(^[0-9]+$)')
        ]
      ],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadUsersFromLocalStorage();
  }

  getUser(): void {
    this.userService.getRandomUser().subscribe({
      next: (response) => {
        const user = response.results[0];
        this.dataSource.data = [...this.dataSource.data, user];
        this.saveUsersToLocalStorage();
      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    });
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.editForm.patchValue({
      title: user.name.title,
      first: user.name.first,
      last: user.name.last,
      city: user.location.city,
      state: user.location.state,
      country: user.location.country,
      postcode: user.location.postcode,
      email: user.email
    });
  }

  saveUser(): void {
    if (this.editForm.valid && this.editingUser) {
      const formValues = this.editForm.value;

      this.editingUser.name.title = formValues.title;
      this.editingUser.name.first = formValues.first;
      this.editingUser.name.last = formValues.last;
      this.editingUser.location.city = formValues.city;
      this.editingUser.location.state = formValues.state;
      this.editingUser.location.country = formValues.country;
      this.editingUser.location.postcode = formValues.postcode;
      this.editingUser.email = formValues.email;

      this.editingUser = null;
      this.dataSource.data = [...this.dataSource.data];
      this.saveUsersToLocalStorage();
    }
  }

  deleteUser(user: User): void {
    this.dataSource.data = this.dataSource.data.filter(u => u !== user);
    this.saveUsersToLocalStorage();
  }

  private saveUsersToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.dataSource.data));
  }

  private loadUsersFromLocalStorage(): void {
    const usersData = localStorage.getItem('users');
    if (usersData) {
      this.dataSource.data = JSON.parse(usersData);
    }
  }
}
