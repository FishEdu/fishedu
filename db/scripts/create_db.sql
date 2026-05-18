CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "login" varchar,
  "email" varchar,
  "password" varchar,
  "birthday" date,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "user_records" (
  "id" integer PRIMARY KEY,
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
  "id" integer PRIMARY KEY,
  "name" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "users_roles" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "role_id" integer,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fish" (
  "id" integer PRIMARY KEY,
  "habitat_id" integer,
  "is_endangered" bool,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fish_pl_translations" (
  "id" integer PRIMARY KEY,
  "fish_id" integer,
  "name" varchar,
  "description" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fish_en_translations" (
  "id" integer PRIMARY KEY,
  "fish_id" integer,
  "name" varchar,
  "description" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_methods" (
  "id" integer PRIMARY KEY,
  "is_passive" bool,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_methods_pl_translations" (
  "id" integer PRIMARY KEY,
  "fishing_method_id" integer,
  "name" varchar,
  "description" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_methods_en_translations" (
  "id" integer PRIMARY KEY,
  "fishing_method_id" integer,
  "name" varchar,
  "description" text,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_methods_fish" (
  "id" integer PRIMARY KEY,
  "fish_id" integer,
  "method_id" integer,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "recipes" (
  "id" integer PRIMARY KEY,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "recipes_pl_translations" (
  "id" integer PRIMARY KEY,
  "recipe_id" int,
  "name" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "recipes_en_translations" (
  "id" integer PRIMARY KEY,
  "recipe_id" int,
  "name" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "recipes_fish" (
  "id" integer PRIMARY KEY,
  "fish_id" integer,
  "recipe_id" integer,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "ingredients" (
  "id" integer PRIMARY KEY,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "ingredients_en_translations" (
  "id" integer PRIMARY KEY,
  "ingredient_id" int,
  "name" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "ingredients_pl_translations" (
  "id" integer PRIMARY KEY,
  "ingredient_id" int,
  "name" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "recipes_ingredients" (
  "id" integer PRIMARY KEY,
  "recipe_id" integer,
  "ingredient_id" integer,
  "ammount" float,
  "unit" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_areas" (
  "id" integer PRIMARY KEY,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_areas_pl_translations" (
  "id" integer PRIMARY KEY,
  "fishing_area_id" integer,
  "name" varchar,
  "description" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "fishing_areas_en_translations" (
  "id" integer PRIMARY KEY,
  "fishing_area_id" integer,
  "name" varchar,
  "description" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "with_url_education_materials" (
  "id" integer PRIMARY KEY,
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
  "id" integer PRIMARY KEY,
  "name" varchar,
  "created_at" timestamp,
  "modified_at" timestamp
);

CREATE TABLE "education_materials" (
  "id" integer PRIMARY KEY,
  "title" varchar,
  "description" text,
  "is_for_novice" bool,
  "is_for_expert" bool,
  "created_at" timestamp,
  "modified_at" timestamp
);

ALTER TABLE "user_records" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "user_records" ADD FOREIGN KEY ("area_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "users_roles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "users_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fish" ADD FOREIGN KEY ("habitat_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fish_pl_translations" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fish_en_translations" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_methods_pl_translations" ADD FOREIGN KEY ("fishing_method_id") REFERENCES "fishing_methods" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_methods_en_translations" ADD FOREIGN KEY ("fishing_method_id") REFERENCES "fishing_methods" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_methods_fish" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_methods_fish" ADD FOREIGN KEY ("method_id") REFERENCES "fishing_methods" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_pl_translations" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_en_translations" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_fish" ADD FOREIGN KEY ("fish_id") REFERENCES "fish" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_fish" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ingredients_en_translations" ADD FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ingredients_pl_translations" ADD FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_ingredients" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recipes_ingredients" ADD FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_areas_pl_translations" ADD FOREIGN KEY ("fishing_area_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "fishing_areas_en_translations" ADD FOREIGN KEY ("fishing_area_id") REFERENCES "fishing_areas" ("id") DEFERRABLE INITIALLY IMMEDIATE;
