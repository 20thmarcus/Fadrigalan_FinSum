const express = require('express');
const app = express();
const port = 4000;
app.use(express.json());

let users = [
	{
		email : "marcusf@email.com",
		password : "marcus123",
		isAdmin : true
	},
	{
		email : "danielle@email.com",
		password : "123danielle",
		isAdmin : false
	}
	];
var dObject = new Date();
let date = dObject.toUTCString();

let products = [
	{
		name: "HeeJin Photocard",
		description : "Heejin's Loona Photocard",
		price : 200,
		isActive : true,
		createdOn : date
	},
	{
		name: "Yves Photocard",
		description : "Loona's Yves Photocard",
		price : 250,
		isActive : false,
		createdOn :  date
	},
	{
		name: "GoWon Photocard",
		description : "Loona's GoWon Photocard",
		price : 150,
		isActive : true,
		createdOn : date
	}
	]

let order = [
{
	userId: 1,
	products : [
{
		name: "HeeJin Photocard",
		description : "Heejin's Loona Photocard",
		price : 200,
		isActive : true,
		createdOn :  new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
},
{
		name: "GoWon Photocard",
		description : "Loona's GoWon Photocard",
		price : 150,
		isActive : true,
		createdOn :  new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
}
		],
		totalAmount: 350,
		purchasedOn: new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
},
{
	userId: 2,
	products : [
{
		name: "HeeJin Photocard",
		description : "Heejin's Loona Photocard",
		price : 200,
		isActive : true,
		createdOn :  new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
},
{
		name: "Yves Photocard",
		description : "Loona's Yves Photocard",
		price : 250,
		isActive : true,
		createdOn :  new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })
}
		],
	totalAmount: 450,
},
	]

app.get('/products/:', (req, res) =>{
	res.send("Anneyeong")
});

//New User
app.post('/users', (req, res) => {
	const newUser = {
		email: req.body.email,
		password : req.body.password,
		isAdmin : req.body.isAdmin
	};
	users.push(newUser);
	res.send("Registered successfully")
});

app.post('/products', (req, res) => {

	console.log(loggedUser)
	console.log(req.body);

	if(loggedUser.isAdmin === true){
		const newItem = {
			name : req.body.name,
			description : req.body.description,
			price : req.body.price,
			isActive : req.body.isActive,
			createdOn : req.body.createdOn
		};
		products.push(newItem);

		res.send("Item added successfully")
	} else {
		res.send("Not an Admin. Not allowed to add Items");
	}
});


app.get('/products', (req, res) => {

	if(loggedUser.isAdmin === true){
		res.send(products)
	} else{
		res.send("you are not the admin")
	}
})

app.get('/products/active', (req, res) => {

	let activeProd = products.filter((products) => products.isActive === true);
	res.send(activeProd);
});
	
app.get('/products/:productId', (req, res) =>{
    console.log(req.params);
    console.log(req.params.productId);
	let productId = parseInt(req.params.productId)

	if (productId >0 && productId < products.length){
		let product = products[productId];
		res.send(product)
	} else {
		res.status(404).send("Invalid ");
	}

})

app.put('/products/archive/:productId', (req, res) => {
  const index = parseInt(req.params.productId);
  if (loggedUser.isAdmin === true) {
    products[index].isActive = false;
    res.send('Product archived');
  } else {
    res.send('Unauthorized');
  }
});

app.put('/products/update/:productId', (req, res) => {

	let productId = parseInt(req.params.productId)

	if(loggedUser.isAdmin = true) {

		if (productId >0 && productId < products.length){

			let productUpdate = {
				name : req.body.name,
				description : req.body.description,
				price : req.body.price,
				isActive : req.body.isActive,
				createdOn : req.body.createdOn,
			};
			products[productId] = productUpdate;
			res.send(products)
		} else {
			res.status(404).send("Product invalid")
		}
	}else {
		res.status(401).send("not an admin")
	}
})

app.post('/create/orders', (req, res) => {
  console.log(req.body);
  if (loggedUser.isAdmin === false) {
    let newOrder = {
      userId: req.body.userId,
      products: req.body.products,
      totalAmount: req.body.totalAmount,
      purchasedOn: req.body.purchasedOn
    };
    order.push(newOrder);
    console.log(order);
 
    res.status(201).send('Order created successfully!');
  } else {
    res.status(401).send('Unauthorized. Only non-admin users can create an order.');
  }
});

app.get('/users/orders', (req, res) => {

	if (loggedUser = true){
		res.send(order)
	} else{
		res.send("Unauthorized. Only Admin is permitted to view orders")
	}

})


//=======================================================================================
app.get('/users/orders', (req, res) => {
  console.log(loggedUser);
  if (loggedUser.isAdmin === true) {
    res.send(order);
  } else {
    res.status(401).send('Only Admin can view orders.');
  }
});

app.get('/orders/:userId', (req, res) => {
  console.log(req.params);
  console.log(req.params.userId);
  let userId = parseInt(req.params.userId);
 
  let selectedOrder = order.find((item) => item.userId === userId);
 
  if (selectedOrder) {
    if (loggedUser.isAdmin) {
      res.status(401).send('Only non-admin users can view the specified order.');
    } else if (selectedOrder.userId === loggedUser.index) {
      res.send(selectedOrder);
    } else {
      res.status(401).send('Only the user who placed the order can view.');
    }
  } else {
    res.status(404).send('Order not found.');
  }
});


app.put('/orders/:orderId', (req, res) => {
  console.log(req.params);
  console.log(req.params.orderId);
  let orderId = parseInt(req.params.orderId);
 
  if (orderId >= 0 && orderId < order.length) {
    let updatedOrder = {
      userId: order[orderId].userId,
      products: req.body.products,
      totalAmount: req.body.totalAmount,
      purchasedOn: order[orderId].purchasedOn
    };
 
    order[orderId] = updatedOrder;
    console.log(order[orderId]);
    res.send('Order updated successfully.');
  } else {
    res.status(404).send('Invalid order ID.');
  }
});
 
app.get('/new/orders/:userId', (req, res) => {
  console.log(loggedUser);
  if (loggedUser.isAdmin === false) {
    let userId = parseInt(req.params.userId);
    let newOrder= order.find((o) => o.userId === userId);  
    if (newOrder) {
      res.send(newOrder);
    } else {
      res.status(404).send('Order not found.');
    }
  } else {
    res.status(401).send('Only non-admin users can view their orders.');
  }
});

 //==========================================================================

// login
app.post('/users/login', (req, res) => {
  console.log(req.body);
 
  let foundUser = users.find((user) => {
    return user.email === req.body.email && user.password === req.body.password;
  });
 
  if (foundUser !== undefined) {
    let foundUserIndex = users.findIndex((user) => {
      return user.email === foundUser.email;
    });
    foundUser.index = foundUserIndex;
    loggedUser = foundUser;
    console.log(loggedUser);
 
    // Check if the user is an admin or non-admin
    if (foundUser.isAdmin) {
      console.log('User is an admin.');
    } else {
      console.log('User is a non-admin.');
    }
 
    return res.send({
      message: 'Thank you for logging in.',
      isAdmin: foundUser.isAdmin
    });
  } else {
    loggedUser = foundUser;
    return res.status(401).send('Login Failed.');
  }
});

app.delete('/order/:productId', (req, res) => {
	console.log(req.params);
	console.log(req.params.productId)

	let index = parseInt(req.params.productId);
	delete order[index];
	res.status(203).send(order);
})


app.listen(port, () => console.log(`Server is running at port ${port}`));



