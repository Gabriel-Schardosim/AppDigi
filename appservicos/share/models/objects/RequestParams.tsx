export class RequestHeaders {
    naoAutenticar = false;
    'g-recaptcha-response': string;
}

export class RequestParams {
    headers = new RequestHeaders();
}
