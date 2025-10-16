const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createStripeProducts() {
  try {
    console.log('Creating Stripe products and prices...');

    // Create Pro Plan Product
    const proProduct = await stripe.products.create({
      name: 'Buildly Pro',
      description: 'For professionals who need more power',
      metadata: {
        plan: 'pro'
      }
    });

    // Create Pro Plan Price (₹299/month)
    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 29900, // ₹299 in paise (smallest currency unit)
      currency: 'inr',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'pro'
      }
    });

    // Create Enterprise Plan Product
    const enterpriseProduct = await stripe.products.create({
      name: 'Buildly Enterprise',
      description: 'For teams and organizations',
      metadata: {
        plan: 'enterprise'
      }
    });

    // Create Enterprise Plan Price (₹999/month)
    const enterprisePrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 99900, // ₹999 in paise
      currency: 'inr',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'enterprise'
      }
    });

    console.log('✅ Products and prices created successfully!');
    console.log('\nAdd these to your PricingModal.tsx:');
    console.log(`Pro Plan Price ID: ${proPrice.id}`);
    console.log(`Enterprise Plan Price ID: ${enterprisePrice.id}`);

    console.log('\nProduct Details:');
    console.log('Pro Product:', proProduct.id);
    console.log('Enterprise Product:', enterpriseProduct.id);

    return {
      pro: {
        productId: proProduct.id,
        priceId: proPrice.id
      },
      enterprise: {
        productId: enterpriseProduct.id,
        priceId: enterprisePrice.id
      }
    };

  } catch (error) {
    console.error('Error creating Stripe products:', error);
    throw error;
  }
}

// Run the script
createStripeProducts()
  .then((result) => {
    console.log('\n🎉 Setup complete! Update your pricing modal with these price IDs.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error.message);
    process.exit(1);
  });