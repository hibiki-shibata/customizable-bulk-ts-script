
// export async function sendJsonBodyRequest({ URI, methodType, securityHeaderName, accessToken, bodyJson }: {
//     URI: string,
//     methodType: string,
//     securityHeaderName: string,
//     accessToken: string,
//     bodyJson: Object
// }): Promise<boolean> {
//     const response = await fetch(URI, {
//         method: `${methodType}`,
//         headers: {
//             'Content-Type': 'application/json',
//             [securityHeaderName]: `${accessToken}`
//         },
//         body: JSON.stringify(bodyJson),
//         signal: AbortSignal.timeout(5000)
//     }).catch(error => {
//         return new Response(null, { status: 500, statusText: error.message });
//     })

//     // Check if the response is ok (status in the range 200-299)
//     if (!response.ok) console.warn(`Error: ${response.status} ${response.statusText}`)

//     return response.ok
// }




// export async function sendNoBodyRequest({ URI, methodType, securityHeaderName, accessToken }: {
//     URI: string,
//     methodType: string,
//     securityHeaderName: string,
//     accessToken: string
// }): Promise<Response> {
//     const response: Response = await fetch(URI, {
//         method: methodType,
//         headers: {
//             [securityHeaderName]: accessToken
//         },
//         // signal: AbortSignal.timeout(5000)
//     }).catch(error => {
//         return new Response(null, { status: 500, statusText: error.message });
//     })

//     if (!response.ok) console.warn(`Error: ${response.status} ${response.statusText}`)

//     return response
// }