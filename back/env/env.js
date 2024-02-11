const {
    DB_USER,
    DB_PASSWORD,
    ADRESS,
    PORT
} = process.env

export default {
    dbUser : DB_USER,
    dbPassword : DB_PASSWORD,
    adress : ADRESS,
    port : PORT,
    urlAdressDb : `mongodb://${DB_USER}:${DB_PASSWORD}@${ADRESS}:${PORT}`
};
