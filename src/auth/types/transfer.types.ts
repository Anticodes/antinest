export type CreateUser = {
    email: string;
    username: string;
    password: string;
};

export type LoginUser = {
    email: string;
    password: string;
};

export type Tokens = {
    access_token: string;
    refresh_token: string;
};
