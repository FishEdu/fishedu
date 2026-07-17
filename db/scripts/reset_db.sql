DROP TABLE IF EXISTS fishing_methods_fish CASCADE;
DROP TABLE IF EXISTS fishing_methods_en_translations CASCADE;
DROP TABLE IF EXISTS fishing_methods_pl_translations CASCADE;
DROP TABLE IF EXISTS fishing_methods CASCADE;

DROP TABLE IF EXISTS recipes_ingredients CASCADE;
DROP TABLE IF EXISTS ingredients_en_translations CASCADE;
DROP TABLE IF EXISTS ingredients_pl_translations CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;

DROP TABLE IF EXISTS recipes_fish CASCADE;
DROP TABLE IF EXISTS recipes_en_translations CASCADE;
DROP TABLE IF EXISTS recipes_pl_translations CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;

DROP TABLE IF EXISTS fish_en_translations CASCADE;
DROP TABLE IF EXISTS fish_pl_translations CASCADE;
DROP TABLE IF EXISTS diets_fish CASCADE;
DROP TABLE IF EXISTS diets_en_translations CASCADE;
DROP TABLE IF EXISTS diets_pl_translations CASCADE;
DROP TABLE IF EXISTS diets CASCADE;
DROP TABLE IF EXISTS fish CASCADE;

DROP TABLE IF EXISTS fishing_areas_en_translations CASCADE;
DROP TABLE IF EXISTS fishing_areas_pl_translations CASCADE;
DROP TABLE IF EXISTS fishing_areas CASCADE;

DROP TABLE IF EXISTS user_records CASCADE;

DROP TABLE IF EXISTS users_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS with_url_education_materials CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS education_materials CASCADE;

DROP TABLE IF EXISTS eco_tips_pl_translations;
DROP TABLE IF EXISTS eco_tips_en_translations;

DROP TABLE IF EXISTS alembic_version;

CREATE TABLE "users" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "login" varchar,
  "email" varchar,
  "password" varchar,
  "birthday" date,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "user_records" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fish_id" integer,
  "total_length" float,
  "fork_length" float,
  "date" date,
  "description" text,
  "area_id" integer,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "roles" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "users_roles" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "user_id" integer,
  "role_id" integer,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fish" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "min_protection_length" float,
  "max_protection_length" float,
  "is_endangered" bool,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fish_pl_translations" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fish_id" integer,
  "habitat_id" integer,
  "name" varchar,
  "description" text,
  "appearance" text,
  "feeding_places" text,
  "preferences" text,
  "handling" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fish_en_translations" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fish_id" integer,
  "habitat_id" integer,
  "name" varchar,
  "description" text,
  "appearance" text,
  "feeding_places" text,
  "preferences" text,
  "handling" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "diets" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "diets_pl_translations" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "diet_id" integer,
  "name" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "diets_en_translations" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "diet_id" integer,
  "name" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "diets_fish" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fish_id" integer,
  "diet_id" integer,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_methods" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "is_passive" bool,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_methods_pl_translations" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fishing_method_id" integer,
  "name" varchar,
  "description" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_methods_en_translations" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fishing_method_id" integer,
  "name" varchar,
  "description" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_methods_fish" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fish_id" integer,
  "method_id" integer,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "recipes" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "recipes_pl_translations" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "recipe_id" int,
  "name" varchar,
  "content" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "recipes_en_translations" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "recipe_id" int,
  "name" varchar,
  "content" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "recipes_fish" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fish_id" integer,
  "recipe_id" integer,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_areas" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_areas_pl_translations" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fishing_area_id" integer,
  "name" varchar,
  "description" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_areas_en_translations" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "fishing_area_id" integer,
  "name" varchar,
  "description" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "with_url_education_materials" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" varchar,
  "url" varchar,
  "type" varchar,
  "description" text,
  "is_for_novice" bool,
  "is_for_expert" bool,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "equipment" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "education_materials" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" varchar,
  "description" text,
  "is_for_novice" bool,
  "is_for_expert" bool,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "eco_tips_pl_translations" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" varchar,
  "description" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "eco_tips_en_translations" (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" varchar,
  "description" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

ALTER TABLE "user_records" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "user_records" ADD FOREIGN KEY ("area_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "users_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "users_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fish_pl_translations" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fish_pl_translations" ADD FOREIGN KEY ("habitat_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fish_en_translations" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fish_en_translations" ADD FOREIGN KEY ("habitat_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "diets_pl_translations" ADD FOREIGN KEY ("diet_id") REFERENCES "diets" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "diets_en_translations" ADD FOREIGN KEY ("diet_id") REFERENCES "diets" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "diets_fish" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "diets_fish" ADD FOREIGN KEY ("diet_id") REFERENCES "diets" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_methods_pl_translations" ADD FOREIGN KEY ("fishing_method_id") REFERENCES "fishing_methods" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_methods_en_translations" ADD FOREIGN KEY ("fishing_method_id") REFERENCES "fishing_methods" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_methods_fish" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_methods_fish" ADD FOREIGN KEY ("method_id") REFERENCES "fishing_methods" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_pl_translations" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_en_translations" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_fish" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_fish" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_areas_pl_translations" ADD FOREIGN KEY ("fishing_area_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_areas_en_translations" ADD FOREIGN KEY ("fishing_area_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;


ALTER TABLE "user_records" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "user_records" ADD FOREIGN KEY ("area_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "users_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "users_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fish_pl_translations" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fish_pl_translations" ADD FOREIGN KEY ("habitat_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fish_en_translations" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fish_en_translations" ADD FOREIGN KEY ("habitat_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "diets_pl_translations" ADD FOREIGN KEY ("diet_id") REFERENCES "diets" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "diets_en_translations" ADD FOREIGN KEY ("diet_id") REFERENCES "diets" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "diets_fish" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "diets_fish" ADD FOREIGN KEY ("diet_id") REFERENCES "diets" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_methods_pl_translations" ADD FOREIGN KEY ("fishing_method_id") REFERENCES "fishing_methods" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_methods_en_translations" ADD FOREIGN KEY ("fishing_method_id") REFERENCES "fishing_methods" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_methods_fish" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_methods_fish" ADD FOREIGN KEY ("method_id") REFERENCES "fishing_methods" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_pl_translations" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_en_translations" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_fish" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_fish" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_areas_pl_translations" ADD FOREIGN KEY ("fishing_area_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_areas_en_translations" ADD FOREIGN KEY ("fishing_area_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;
