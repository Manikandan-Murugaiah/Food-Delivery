
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT =  3000;

// Data Dummy
const pricingData = {
  "005": {
    "central": { base_distance_in_km: 5, km_price: { perishable: 1.5, non_perishable: 1 }, fix_price: 10 }
  }
};


function calculatePrice(organizationId, zone, totalDistance, itemType) {
  const { base_distance_in_km, km_price, fix_price } = pricingData[organizationId][zone];
  
  const excessDistance = totalDistance - base_distance_in_km;
  let totalPrice = fix_price;
  if (excessDistance > 0) {
    const perKmPrice = itemType === 'perishable' ? km_price.perishable : km_price.non_perishable;
    totalPrice += perKmPrice * excessDistance;
  }
  
  return totalPrice * 100;
}

// Middleware
app.use(bodyParser.json());

// post
app.post('/calculatePrice', (req, res) => {
  const { organization_id, zone, total_distance, item_type } = req.body;
  try {
    const totalPrice = calculatePrice(organization_id, zone, total_distance, item_type) / 100; 
    res.status(200).json({ total_price: totalPrice.toFixed(1) }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//  server 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
