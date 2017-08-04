var Arrivals = (function() {
    function ArrivalViewModel() {
        var self = this;
        self.title = "";
        self.author = "";
		self.description = "";
		self.url = "";
		self.urlToImage = "";
        self.publishedAt = "";
    }

    function ArrivalApiService() {
        var self = this;

        // retrieves all arrivals from the API
        self.getAll = function() {
            return new Promise(function(resolve, reject) {
                var request = new XMLHttpRequest();
                request.open('GET', 'https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=b1847e0da84043abb73f5669ffbc87c5');

                request.onload = function() {
                    // success
                    if (request.status === 200) {
                        // resolve the promise with the parsed response text (assumes JSON)
                        resolve(JSON.parse(request.response));
                    } else {
                        // error retrieving file
                        reject(Error(request.statusText));
                    }
                };

                request.onerror = function() {
                    // network errors
                    reject(Error("Network Error"));
                };

                request.send();
            });
        };
    }

    function ArrivalAdapter() {
        var self = this;

        self.toArrivalViewModel = function(data) {
            if (data) {
                var vm = new ArrivalViewModel();
               // vm.title = data.title;
              //  vm.status = data.status;
               // vm.time = data.time;
				
					vm.title = data.title;
					vm.author = data.author;
					vm.description = data.description;
					vm.url = data.url;
					vm.urlToImage = data.urlToImage;
					vm.publishedAt = data.publishedAt;

                return vm;
            }
            return null;
        };

        self.toArrivalViewModels = function(data) {
            if (data && data.length > 0) {
                return data.map(function(item) {
                    return self.toArrivalViewModel(item);
                });
            }
            return [];
        };
    }

    function ArrivalController(arrivalApiService, arrivalAdapter) {
        var self = this;

        self.getAll = function() {
            // retrieve all the arrivals from the API
            return arrivalApiService.getAll().then(function(response) {
                return arrivalAdapter.toArrivalViewModels(response.articles);
            });
        };
    }


    // initialize the services and adapters
    var arrivalApiService = new ArrivalApiService();
    var arrivalAdapter = new ArrivalAdapter();

    // initialize the controller
    var arrivalController = new ArrivalController(arrivalApiService, arrivalAdapter);    

    return {
        loadData: function() {
            // retrieve all routes
            document.querySelector("body").classList.add('loading')
            arrivalController.getAll().then(function(response) {
                // bind the arrivals to the UI
                Page.vm.arrivals(response);
                document.querySelector("body").classList.remove('loading')
            });
        }
    }

})();
