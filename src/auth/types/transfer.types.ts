export type CreateUser = {
    email: string;
    username: string;
    password: string;
};

export type LoginUser = {
    email: string;
    username: string;
    password: string;
};

export type Tokens = {
    action_token: string;
    refresh_token: string;
};
