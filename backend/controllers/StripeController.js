const stripe = require('stripe')('sk_test_51P9CstEsTOLnosuywUMmL8iuef3sGKNc65KQ4UyRxVLeYI8TCzHTxldCqR8meJxswSracsgKuD1C0hCcTQzZNIcm00zZZ2JKKK')

async function createPaymentIntent(name, description, amount, successUrl, cancelUrl) {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: Math.round(amount * 100),
                        product_data: {
                            name: name,
                            description: description,
                        }
                    },
                    quantity: 1
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });
        return session.id;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return undefined;
    }
}

async function checkPaymentStatus(sessionId) {
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        return session.payment_status === 'paid';
    } catch (error) {
        return false;
    }
}

module.exports = {
    createPaymentIntent,
    checkPaymentStatus
};