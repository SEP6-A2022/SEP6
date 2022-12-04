export interface ITokenResponse {
    access_token: string;
    token_type:   string;
    scope:        string;
}

export interface IUserResponse {
    login:               string;
    id:                  number;
    node_id:             string;
    avatar_url:          string;
    gravatar_id:         string;
    url:                 string;
    html_url:            string;
    followers_url:       string;
    following_url:       string;
    gists_url:           string;
    starred_url:         string;
    subscriptions_url:   string;
    organizations_url:   string;
    repos_url:           string;
    events_url:          string;
    received_events_url: string;
    type:                string;
    site_admin:          boolean;
    name:                null;
    company:             string;
    blog:                string;
    location:            string;
    email:               string;
    hireable:            boolean;
    bio:                 string;
    twitter_username:    null;
    public_repos:        number;
    public_gists:        number;
    followers:           number;
    following:           number;
    created_at:          string;
    updated_at:          string;
}

export interface IJwtData {
    email: string
    name: string,
    isAdmin: boolean,
    id: number,
    get_access: boolean
    get_refresh: boolean
    exp: number
}

export interface IRegisterUser {
    email: string,
    password: string
}

export interface IMovieAPIresponse {
    Title:      string;
    Year:       string;
    Rated:      string;
    Released:   string;
    Runtime:    string;
    Genre:      string;
    Director:   string;
    Writer:     string;
    Actors:     string;
    Plot:       string;
    Language:   string;
    Country:    string;
    Awards:     string;
    Poster:     string;
    Ratings:    Rating[];
    Metascore:  string;
    imdbRating: string;
    imdbVotes:  string;
    imdbID:     string;
    Type:       string;
    DVD:        string;
    BoxOffice:  string;
    Production: string;
    Website:    string;
    Response:   string;
}

export interface Rating {
    Source: string;
    Value:  string;
}
