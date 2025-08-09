import checkoutServerSdk from '@paypal/checkout-server-sdk'

export const environment = () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    return new checkoutServerSdk.core.SandboxEnvironment(clientId, clientSecret);
    // For live:
    // return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
}

export const client = () => {
    return new checkoutServerSdk.core.PayPalHttpClient(environment());
}