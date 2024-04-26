const stripe = require('stripe')('sk_test_51P9CstEsTOLnosuywUMmL8iuef3sGKNc65KQ4UyRxVLeYI8TCzHTxldCqR8meJxswSracsgKuD1C0hCcTQzZNIcm00zZZ2JKKK')

async function createPaymentIntent(req, res) {
    try {
        const { name, description, amount, successUrl, cancelUrl } = req.body;

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

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
}

module.exports = createPaymentIntent;