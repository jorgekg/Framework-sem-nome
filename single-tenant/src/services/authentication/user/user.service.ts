import * as admin from 'firebase-admin';
import axios from 'axios';

import { Payload } from '@libs/handler.decorators';
import { CrudService } from '@libs/service.crud';

import { NotFoundException } from '@exceptions/not-found.exception';

import { User, UserFactory } from '@models/authorization/user.model';

const serviceAccount = require('../../../../firebase-adminsdk');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export class UserService extends CrudService<User> {

  constructor(payload: Payload) {
    super(payload, UserFactory());
  }

  public async createAdminUser(): Promise<User> {
    const user = await this.create({
      email: 'admin@admin.com',
      password: '158sd&b5t4l',
      isAdmin: true,
      name: 'Admin'
    } as any);
    return user;
  }

  protected async beforeCreate(entity: User): Promise<User> {
    const passAt = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const passArray = Array.from({ length: 8 });
    entity.email = entity.email.trim();
    (entity as any).password = passArray.map(function () {
      return passAt.charAt(Math.random() * passAt.length);
    }).join('');
    await admin.auth().createUser({
      email: entity.email,
      password: (entity as any).password,
      emailVerified: true
    });
    entity.isAdmin = !!entity.isAdmin;
    return entity;
  }

  protected async afterCreate(entity: User, entitySaved: User): Promise<User> {
    await axios.post('https://qfqun7q0vi.execute-api.us-east-1.amazonaws.com/Prod/email', {

      email: entitySaved.email,
      message: `Olá!

Segue os dados de acesso ao Sistema Nome Sistema

Link: https://portal-Nome Sistema.web.app/
Usuário: ${entity.email}
Senha: ${(entity as any).password}

          `,
      subject: "Bem vindo - Nome Sistema"
    });
    return entitySaved;
  }

  protected async beforeDelete(id: string): Promise<void> {
    const user = await this.get(id);
    try {
      const userFinded = await admin.auth().getUserByEmail(user.email);
      if (userFinded) {
        await admin.auth().deleteUser(userFinded.uid);
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async resetPassword(email: string) {
    const link = await admin.auth().generatePasswordResetLink(email);
    console.log(link);
  }

  public async getUserByEmail(email: string) {
    const users = await this.getAll("email", email);
    if (!users?.length) {
      throw new NotFoundException(`E-mail ${email} não encontrado!`);
    }
    return users[0];
  }

  public async getUsersAdmin() {
    return await UserFactory().findAll({
      where: {
        isAdmin: true
      }
    });
  }

}