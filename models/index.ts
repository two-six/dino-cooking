import { Bson } from "https://deno.land/x/mongo@v0.29.1/mod.ts";

enum lang{
    EN,
};

interface Ingredient {
    name: string;
    amount: string;
};

export interface Recipe {
    _id: Bson.ObjectId;
    author?: string;
    title: string;
    expected_time?: number;
    ingredients: Array<Ingredient>;
    language: lang;
    description?: string;
    instructions: string;
    donations?: string;
};

export interface User {
    _id: Bson.ObjectId;
    username: string;
    password: string;
    email: string;
};

export interface UserData {
    _id: Bson.ObjectId;
    username: string;
    email: string;
    recipies: Array<Recipe>;
}