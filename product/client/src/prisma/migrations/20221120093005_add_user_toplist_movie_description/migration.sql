-- CreateTable
CREATE TABLE "directors" (
    "movie_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,

    CONSTRAINT "directors_pkey" PRIMARY KEY ("movie_id","person_id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "year" DECIMAL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "birth" DECIMAL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "movie_id" INTEGER NOT NULL,
    "rating" REAL NOT NULL,
    "votes" INTEGER NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("movie_id")
);

-- CreateTable
CREATE TABLE "stars" (
    "movie_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,

    CONSTRAINT "stars_pkey" PRIMARY KEY ("movie_id","person_id")
);

-- CreateTable
CREATE TABLE "toplist" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "moviesJson" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "toplist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "saltedPassword" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "preferencesJson" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "directors" ADD CONSTRAINT "directors_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "directors" ADD CONSTRAINT "directors_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stars" ADD CONSTRAINT "stars_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stars" ADD CONSTRAINT "stars_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "toplist" ADD CONSTRAINT "toplist_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
