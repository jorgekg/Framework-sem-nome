import * as admin from 'firebase-admin';
import axios from 'axios';

import { Payload } from '@libs/handler.decorators';
import { CrudService } from '@libs/service.crud';

import { NotFoundException } from '@exceptions/not-found.exception';

import { User, UserFactory } from '@models/authorization/user.model';
import { ConflictedException } from '@exceptions/conflicted.exception';
import { BadRequestException } from '@exceptions/bad-request.exception';
import { SchemaFactory } from '@models/authorization/schema.model';

const serviceAccount = require('../../../../firebase-adminsdk');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export class UserService extends CrudService<User> {

  constructor(payload: Payload) {
    super(payload, UserFactory('public'));
  }

  public async createAdminUser() {
    try {
      await admin.auth().createUser({
        email: 'admin@admin.com',
        password: '8LWP5%2z',
        emailVerified: true
      });
    } catch (err) {
    }
  }

  protected async beforeCreate(entity: User): Promise<User> {
    try {
      await admin.auth().createUser({
        email: entity.email,
        password: entity.password,
        emailVerified: true
      });
    } catch (err) {
      if (err?.errorInfo?.code === 'auth/email-already-exists') {
        throw new ConflictedException('E-mail já registrado!');
      } else if (err?.errorInfo?.code === 'auth/invalid-password') {
        throw new BadRequestException('Senha inválida');
      } else {
        throw err;
      }
    }
    const schema = (await SchemaFactory('public').findOne({
      where: { name : this.payload.schema }
    }));
    if(schema){
      entity.schema = (schema as any).dataValues.id;
    }

    
    return entity;
  }

  protected async beforeDelete(id: string): Promise<void> {
    const user = await this.get(id);
    await this.deleteByEmailFromFirebase(user.email);
  }

  public async deleteByEmailFromFirebase(email: string) {
    try {
      const userFinded = await admin.auth().getUserByEmail(email);
      if (userFinded) {
        await admin.auth().deleteUser(userFinded.uid);
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async resetPassword(email: string) {
    const link = await admin.auth().generatePasswordResetLink(email);

    await axios.post('https://qfqun7q0vi.execute-api.us-east-1.amazonaws.com/Prod/email', {

      email: email,
      message: `Olá!

Clique no link abaixo para redefinir sua senha.

${link}

Caso tenha algum problema para acessar, fale com o responsável pelo sistema.
          `,
      subject: "Solicitação de troca de senha - Bell"
    });
  }

  public async getUserByEmail(email: string) {
    const users = await this.getAll("email", email);
    if (!users?.length) {
      throw new NotFoundException(`E-mail ${email} não encontrado!`);
    }
    return users[0];
  }
}