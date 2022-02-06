
const zipCodeInput = document.querySelector('#zipCodeInput');
const foodBanksTable = document.querySelector('#foodBanksTable');
const button = document.querySelector('#zipCodeButton');
const output = document.querySelector('#output');

const fetchCoordinates = async () => {
	try{
		const zipCode = zipCodeInput.value;
		const res = await axios.get(`https://geocode.xyz/?geoit=JSON&region=US&locate=${zipCode}`, zipCode);
		const lat = res.data.latt;
		const long = res.data.longt;
		console.log(lat + ", " + long);
		if(lat == undefined || long == undefined){
			throw new Exception;
		}
		fetchFoodBanks(lat, long);
	}catch(e){
		console.log("Invalid Input!", e);
		clearFoodBanks("Invalid Input!");

	}
}

const fetchFoodBanks = async(lat, long) => {
	try{
		const res2 = await axios.get(`https://api.alpha.ca.gov/FoodBanks?lat=${lat}&lon=${long}`, lat, long);
		getFoodBanks(res2.data);

	}catch(e){
		console.log("Unable to process the request at this moment", e);
		clearFoodBanks("Unable to process the request at this moment. Please make sure you have entered a California zipcode.");
	}
}

//function to handle escape characters returned from api
function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

const getFoodBanks = (foodBanksData) => {
	//create table headers
	const newTR = document.createElement('TR');
	const newTHName = document.createElement('TH');
	const newTHDistance = document.createElement('TH');
	const newTHAddress = document.createElement('TH');
	const newTHWebsite = document.createElement('TH');
	newTHName.append("Name");
	newTHDistance.append("Distance (miles)");
	newTHAddress.append("Address");
	newTR.append(newTHName);
	newTR.append(newTHDistance);
	newTR.append(newTHAddress);
	foodBanksTable.append(newTR);

	//add each food bank to the table
	for(let foodBank of foodBanksData){
		//manage escape HTML characters using htmlDecode function
		const name = htmlDecode(foodBank.properties.title);
		//round distance to 2 decimal places
		const distance = Math.round(foodBank.properties.distance * 100)/100;
		const website = foodBank.properties.website;
		// can we open google map??? embedded and inline??
		const address = foodBank.properties.address;
		const city = foodBank.properties.city;
		const addressInfo = address + ", " + city;
		addFoodBanks(name, distance, addressInfo, website);
	}

	foodBanksTable.style.backgroundColor = "#F5FAFA";
}

const addFoodBanks = (name, distance, address, website) => {
	const newRow = document.createElement('TR');
	const newNameTD = document.createElement('TD');
	const newDistanceTD = document.createElement('TD');
	const newAddressTD = document.createElement('TD');
	// make it a link that is clickable in another tab
	const a = document.createElement('A');
	a.append(name)
	a.href = website;
	a.target = "_blank";
	newNameTD.append(a);
	newDistanceTD.append(distance);
	newAddressTD.append(address);

	newRow.append(newNameTD);
	newRow.append(newDistanceTD);
	newRow.append(newAddressTD);
	foodBanksTable.append(newRow);
}

const clearFoodBanks = (message) => {
	// As long as the table has a child node, remove it
	while (foodBanksTable.hasChildNodes()) {  
 		foodBanksTable.removeChild(foodBanksTable.firstChild);
	}
	foodBanksTable.style.backgroundColor = "white";
	if(message != ""){
		const errorMessage = document.createElement('p');
		errorMessage.append(message);
		output.append(errorMessage);
	}
}

button.addEventListener('click', function(e){
	e.preventDefault();
	// clear foodBanksTable and Invalid input string when button is clicked
	if(output.contains(document.querySelector('#output p'))){
		console.log(true);
		output.removeChild(output.lastChild);
	}
	clearFoodBanks("");
	//obtain the food banks
	fetchCoordinates();
});

