type ApiRequestParams = {
    URI: string,
    methodType: string,
    securityHeaderName: string,
    accessToken: string,
    bodyJson?: Object
}

export async function sendAPIRequest(apiRequestParam: ApiRequestParams): Promise<Response> {
    const response: Response = await fetch(apiRequestParam.URI, {
        method: `${apiRequestParam.methodType}`,
        headers: {
            'Content-Type': 'application/json',
            [apiRequestParam.securityHeaderName]: `${apiRequestParam.accessToken}`
        },
        body: apiRequestParam.bodyJson ? JSON.stringify(apiRequestParam.bodyJson) : undefined,
        signal: AbortSignal.timeout(5000)
    }).catch(error => new Response(null, { status: 500, statusText: error.message }))
    if (!response) console.warn(`No response received from ${apiRequestParam.URI}`)
    return response
}
