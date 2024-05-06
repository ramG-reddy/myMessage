# myMessage-backend

## Tech stack used 

Prisma

MongoDB atlas (in .env variables , insert proper URI )

Graphql  (path by default is /graphql on port 4000 ) 

## Setup code

`npm i `

`npx prisma generate --schema=src/prisma/schema.prisma`

## Possible errors

| ERROR | SOLUTION |
|----|----|
| Prisma client error | setup code run properly (`npx prisma generate` command) |
| Warning during `npm i` | We are using v3 next-auth , if encountered ignore  |
| Cors error | Check the add in cors options in apollo server , ./src/index.ts |
| Random Prisma errors | Change network and Re-run the app |

# Every version matters, be aware