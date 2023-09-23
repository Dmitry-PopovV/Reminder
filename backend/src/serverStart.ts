import {AppDataSource} from "./data-source";

export default async function serverStart() {
    await AppDataSource.initialize();
}