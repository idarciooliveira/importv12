import 'dotenv/config'
import path from 'path';
import * as fs from 'fs'
import { db } from './db';
import { Schema } from './type';
import * as PgSchema from '../drizzle/schema'
import JSONStream from 'big-json'

const file = path.resolve(__dirname, '..', 'datasets', 'hearth-dataset.json')

const readStream = fs.createReadStream(file, 'utf-8')

const jsonStream = JSONStream.createParseStream()


jsonStream.on('data', (data: Schema[]) => {
    try {
        var count = 5500;
        data.forEach(element => {
            count++
            db.insert(PgSchema.places)
                .values({
                    //@ts-ignore
                    id: count.toString(),
                    name: element.NameOriginal,
                    category: element.HealthEstablishmentType,
                    address: element.Address || `${element.Province}, ${element.NameOriginal}`,
                    lat: Number(element.Latitude),
                    long: Number(element.Longitude),
                    email: element.Email,
                    geometry: '',
                    website: element.Website,
                    phoneNumber: element.Telephone1,
                    imageUrl: element.MainImage,
                    state: `${element.Province}, ${element.County}`,
                    country: 'Angola',
                    isApproved: true,
                })
                .onConflictDoNothing()
                .then()
        });

        console.log(count)
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
})

jsonStream.on('end', () => console.log('finished task'))

//@ts-ignore
readStream.pipe(jsonStream)