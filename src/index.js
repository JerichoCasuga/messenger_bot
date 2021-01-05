

const { router, payload, text } = require('bottender/router');
const data = require('./data.json');



const SendMenu = async (context) => {
  await context.sendGenericTemplate(data.menu);
};

const SendQuantity = async (context) => {
  const quickReplies = [];
  for (let i = 1; i <= 3; i++) {
    const r = {
      contentType: 'text',
      title: i.toString(),
      payload: `QTY_${i}`
    };

    quickReplies.push(r);
  }
  
  await context.sendText('How many would you like to order?', { quickReplies });
};

const sendShopMore = async (context) => {
  await context.sendText('Would you like to shop more or checkout?', {
    quickReplies: [
      {
        contentType: 'text',
        title: 'Shop more?',
        payload: 'MENU_TODAY'
      },
      {
        contentType: 'text',
        title: 'Checkout',
        payload: 'CHECKOUT'
      }
    ]
  });
};

const sendAskAddress = async (context) => {
  await context.sendText('Where would you like us to deliver your food?');
};

const sendConfirmationQuery = async (context) => {
  await context.sendText('Thank you. Do you confirm your order?', {
    quickReplies: [
      {
        contentType: 'text',
        title: 'Yes, I confirm',
        payload: 'CONFIRM_ORDER'
      }
    ]
  });
};

const sendReceipt = async (context) => {
  await context.sendText(
    'Thank you for confirming your order. Here is your order confirmation'
  );

  await context.sendReceiptTemplate({
    recipientName: 'Jericho Casuga',
    orderNumber: '12345678902',
    currency: 'PHP',
    paymentMethod: 'Cash',
    elements: [
      {
        title: 'Adobo',
        subtitle: 'Naapgad',
        quantity: 1,
        price: 50,
        currency: 'PHP',
        image_url:
          'https://www.foxyfolksy.com/wp-content/uploads/2017/06/pork-adobo-640-500x375.jpg'
      }
    ],
    summary: {
      subtotal: 50.0,
      shippingCost: 10.0,
      totalCost: 60.0
    }
  });
};

module.exports = async function App(context) {
  return router([
    payload(['MENU_TODAY'], SendMenu),
    payload(['MENU_ADOBO', 'MENU_SINIGANG', 'MENU_HALOHALO'], SendQuantity),
    payload(['QTY_1', 'QTY_2', 'QTY_3'], sendShopMore),
    payload('CHECKOUT', sendAskAddress),
    text('address', sendConfirmationQuery),
    payload('CONFIRM_ORDER', sendReceipt)
  ]);
};