import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';

function CheckoutForm({ amount, clientSecret, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            }
        );

        if (error) {
            toast.error(error.message);
        } else if (paymentIntent.status === 'succeeded') {
            toast.success('Payment successful!');
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit}>      
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay ${amount / 84} {/* Ensure this is correct based on amount received */}
            </button>
        </form>
    );
}

export default CheckoutForm;
