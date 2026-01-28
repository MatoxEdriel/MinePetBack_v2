
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { tenantStorage } from 'src/interfaces/tenant-storage';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {

  //primero traemos  los clientes los tenant


  //todo
  /*
Uso especifico de HasgMap 
con esto creamos llave / valor para asignar una conexion a la base de dato 
con eso creamos un tipo almacen de conexiones por eso en el clients 

  */
  private clients: Map<string, PrismaClient> = new Map();



  constructor(private _configService: ConfigService) {

    const dbUrl = _configService.get<string>('DATABASE_URL');

    if (!dbUrl) {
      throw new Error('Database url no encontrada')

    }

    const pool = new PrismaPg({ connectionString: dbUrl });
    super({ adapter: pool });
  }


  async onModuleDestroy() {
    //aqui recorrere todo el map de las conexioens y cerrara cada uno 
    //porque si se hace manuales  las 10 conexiones llegara al limite  toomany connections


    for (const client of this.clients.values()) {
      await client.$disconnect();


    }




  }



  get client(): PrismaClient {
    //!Viene del metodo que instancie AsyncLocalStorage de node js 

    //? El metodo getStore() es como leer una etiqueta asignada al recorrido de la 
    //? de la peticion 

    //!getstore() con esto devuelve la etiqueta exacta de la persona o tenant que hace la request 
    const schema = tenantStorage.getStore();

    const currentSchema = schema || 'public';


    //usamos el metodo has que deuelve un boolean 
    //revisamos si tiene conexion o un calor si no tiene
    //se instancia una nueva conexion 
    if (!this.clients.has(currentSchema)) {

      const databaseUrl = this._configService.get<string>('DATABASE_URL');

      if (!databaseUrl) {
        throw new Error('Database not defined en el archivo .env')

      }

      const newClient = new PrismaClient({
        datasource: {

          db: {
            url: `${databaseUrl}?schema=${currentSchema}`
          },

        }
      } as any)
      this.clients.set(currentSchema, newClient)

    }

    return this.clients.get(currentSchema)!;
  }


  //! Connect es implicito cuando 


  //! en este ejemplo se hacia conexion manuales porque se heredaba 
  //la conexion se hace cuando se instancia de this.prisma.user.findMany()
  // async onModuleInit() {
  //   await this.$connect();
  // }
}


//Ahora cmo la conexion ya no se hace unitaria ahora se hara dependiendo de las conexiones que se haga. 



