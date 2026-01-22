type ApiRequestParams = {
    URI: string,
    methodType: string,
    securityHeaderName: string,
    accessToken: string,
    bodyJson?: Object
}

export async function sendAPIRequest(apiRequestParam: ApiRequestParams): Promise<Response> {

    const options: RequestInit = {
        method: apiRequestParam.methodType,
        headers: {
            'Content-Type': 'application/json',
            [apiRequestParam.securityHeaderName]: `${apiRequestParam.accessToken}`
        },
        signal: AbortSignal.timeout(5000)
    }

    if (apiRequestParam.methodType !== 'GET' && apiRequestParam.methodType !== 'HEAD') {
        options.body = JSON.stringify(apiRequestParam.bodyJson)
    }

    const response: Response = await fetch(apiRequestParam.URI, options).catch(error => {
        return new Response(null, { status: 500, statusText: error.message })
    })
    
    if (!response) console.warn(`No response received from ${apiRequestParam.URI}`)
    return response
}
