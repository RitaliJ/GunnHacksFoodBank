


const zipCodeInput = document.querySelector('#zipCodeInput');
const foodBanksList = document.querySelector('#foodBanksList');
const button = document.querySelector('#zipCodeButton');

const fetchCoordinates = async () => {
	try{
		const zipCode = zipCodeInput.value;
		const res = await axios.get(`https://geocode.xyz/?geoit=JSON&region=US&locate=${zipCode}`, zipCode);
		//const res = await axios.get('https://geocode.xyz/?locate=95148&geoit=JSON&region=US');
		const lat = res.data.latt;
		const long = res.data.longt;
		console.log(lat + ", " + long);
	}catch(e){
		console.log("Error! ", e);

	}
}

const addFoodBanks = () => {
	const newLI = document.createElement('LI');
	newLI.append();
	foodBanksList.append(newLI);
}

button.addEventListener('click', function(e){
	e.preventDefault();
	fetchCoordinates();
});
// clear foodBanksList
