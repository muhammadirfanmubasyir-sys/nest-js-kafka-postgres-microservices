import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

import { Pool } from 'pg';

import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from './schema'; 
 


@Injectable()
export class DatabaseService implements OnModuleDestroy {
    private readonly LOGGER = new Logger(DatabaseService.name);

    private pool: Pool;
    public db: NodePgDatabase<typeof schema>;

    constructor() {
        this.LOGGER.log("DATABASE_URL : ${process.env.DATABASE_URL}");

        if (! process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL environment variable is not defined');
        }

        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        }); 
        
        this.db = drizzle(this.pool, { schema });   

        console.log('DATABASE CONNECTED !!');
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}
