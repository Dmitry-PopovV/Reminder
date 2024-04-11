import { Event } from "../entity/Event";

export default async function createDBFunctions() {
    await Event.query(
        `CREATE OR REPLACE FUNCTION getMonth(d timestamp with time zone) returns integer as $$
            SELECT CAST(EXTRACT(MONTH FROM d) AS integer)
        $$ LANGUAGE SQL;
        
        CREATE OR REPLACE FUNCTION getPeriodicity(str character varying) returns integer as $$
            SELECT CAST(substring(str from POSITION('/' IN str) + 1 for char_length(str)) AS integer)
        $$ LANGUAGE SQL;
        
        CREATE OR REPLACE FUNCTION getDate(d timestamp with time zone) returns integer as $$
            SELECT CAST(EXTRACT(DAY FROM d) AS integer)
        $$ LANGUAGE SQL;
        
        CREATE OR REPLACE FUNCTION difference(per character varying, d1 timestamp with time zone, d2 timestamp with time zone) returns integer as $$
            SELECT CASE WHEN (per = 'week') THEN
                CAST(DATE_PART('day', AGE(d1, d2)) / 7 AS integer)
            ELSE
                CAST(DATE_PART(per, AGE(d1, d2)) AS integer)
            END;
        $$ LANGUAGE SQL;
        
        CREATE OR REPLACE FUNCTION doesPeriodMatch(per character varying, periodicity character varying, evTime timestamp with time zone, d timestamp with time zone) returns boolean as $$
            SELECT POSITION('/' IN periodicity) != 0 AND
            MOD(difference(per, evTime, d), getPeriodicity(periodicity)) = 0
        $$ LANGUAGE SQL;

        CREATE OR REPLACE FUNCTION getDay(d timestamp with time zone) returns integer as $$
            SELECT CAST(EXTRACT(DOW FROM d) AS integer)
        $$ LANGUAGE SQL;

        CREATE OR REPLACE FUNCTION isDayOfWeekThisDay(d timestamp with time zone, dowPer character varying, wdNumber integer) returns boolean as $$
            SELECT date_trunc('minute', d) =
            date_trunc('week', date_trunc('month', d)) + make_interval(days =>
                CAST(dowPer AS integer) + 7 * (
                    wdNumber - (
                        CAST(CAST(getDay(date_trunc('month', d)) <= CAST(dowPer AS integer) AS boolean) AS integer)
                    )
                ) -1
            )
        $$ LANGUAGE SQL;

        CREATE OR REPLACE FUNCTION getNumber(str character varying) returns integer as $$
            SELECT CAST(substring(str from 1 for POSITION('/' IN str) - 1) AS integer)
        $$ LANGUAGE SQL;

        CREATE OR REPLACE FUNCTION isNumber(str character varying) returns boolean as $$
            SELECT str ~ '^[0-9]+$'
        $$ LANGUAGE SQL;`
    );
}
