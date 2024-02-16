import { Events } from "../entity/Events";

export default async function createDBFunctions() {
    await Events.query(
        `CREATE OR REPLACE FUNCTION getMonth(d timestamp with time zone) returns integer as $$
            SELECT EXTRACT(MONTH FROM CAST(d AS TIMESTAMP))
        $$ LANGUAGE SQL;
        
        CREATE OR REPLACE FUNCTION getMonthPeriodicity(str character varying) returns integer as $$
            SELECT CAST(substring(str from POSITION('/' IN str) + 1 for char_length(str)) AS numeric)
        $$ LANGUAGE SQL;`
    );
}