const app = new Vue({
  el: "#app",
  data: {
    page: "content",
    lessons: [],
    sorting: "price",
    cart: [],
    search: "",
    name: "",
    phone: "",
    baseURL: "https://webstore-env.eba-b24bpdfp.eu-west-2.elasticbeanstalk.com",

    disabled: [true, true],
    sortOption: "",
    orderOption: "",
  },
  created: function () {

    this.fetchLessons();
  },
  methods: {
    // fetch lessons
    fetchLessons() {
      fetch(`${this.baseURL}/collections/lessons`).then(
        function (response) {
          response.json().then(
            function (json) {

              app.lessons = json;
            }
          )
        });
    },
     // search lesson
     searchLessons(searchText) {
      fetch(`${this.baseURL}/collections/lessons/search/${searchText}`).then(
          function (response) {
              response.json().then(
                  function (json) {
                      app.lessons = json;
                  }
              )
          });
  },
    // method that inserts a new order with POST
    postOrder(jsonData) {
      fetch(`${this.baseURL}/collections/orders`, {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => response.json())
        .then(responseData => {
          console.log(responseData);
        })
        .catch(error => {
          console.log(error);
        });
    },
    // method to update lesson collection
    updateLessonSpace(jsonData, _id) {

      fetch(`${this.baseURL}/collections/lessons/${_id}`, {
        method: "PUT",
        body: JSON.stringify(jsonData),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => response.json())
        .then(responseData => {
          console.log(responseData);
        })
        .catch(error => {
          console.log(error);
        });
    },
    // Add lesson to cart
    addtocart(lesson) {
      --lesson.spaces;
      // find selected lesson in cart
      var lessonInCart = this.cart.find(u => u.lessonId == lesson._id);

      // if lessonIncart is empty, add selected lesson to cart, otherwise update selected lesson spaces in cart
      if (lessonInCart != null) {
        ++lessonInCart.spaces;
      } else {
        lessonInCart = { lessonId: lesson._id, spaces: 1, lesson: lesson };
        this.cart.push(lessonInCart);
      }
    },
    // Remove lesson from cart
    removefromcart(id) {
      var itemInCart = this.cart.find(u => u.lessonId == id);

      if (itemInCart.spaces == 1) {
        var index = this.cart.map(x => x.lessonId).indexOf(id);
        this.cart.splice(index, 1);

        //when the cart is empty goes back to home page
        if (this.cart.length <= 0) {
          this.page = 'content'
        }
      } else {
        --itemInCart.spaces;
      }

      // update lesson space
      var lesson = this.lessons.find(u => u._id == id);
      ++lesson.spaces;
    },
    // Checking to see if the user can add a lesson to cart
    canaddtocart(lesson) {
      return lesson.spaces > this.cartSpace(lesson);
    },
    // Lesson Cart Count 
    cartSpace(lesson) {
      let x = 0;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i] == lesson) {
          x++;
        }
      }
      return x;
    },
    // Switching Pages
    navigateTo(page) {
      this.page = page;
    },

    // validate name
    validateNameInput() {
      let result = /^[a-zA-Z]+$/.test(this.name);
      return result;
    },
    // validate phone
    validatePhoneInput() {
      let result = /^\d+$/.test(this.phone);
      return result;
    },
    // Confirmation of order submission 
    checkout() {

      // processing items in cart
      this.cart.forEach((itemInCart) => {
        var order = {
          lessonId: itemInCart.lessonId,
          spaces: itemInCart.spaces,
          topic: itemInCart.lesson.topic,
          name: this.name,
          phoneNumber: this.phone
        };
        this.postOrder(order);

        // update available lesson space with put
        var lessonToUpdate = { spaces: itemInCart.lesson.spaces }
        this.updateLessonSpace(lessonToUpdate, itemInCart.lessonId);
      });

      alert("Your order has been successfully submitted");
      this.cart = [];

      this.navigateTo("content");
    },
     // Search and Sort
     filteredLessons() {
      // Sort Function
      this.lessons.sort((a, b) => {
        // Sorting according to subject
        if (this.sortOption == "subject") {
          let fa = a.topic.toLowerCase(),
            fb = b.topic.toLowerCase();

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        }
        // Sorting according to location
        else if (this.sortOption == "location") {
          let fa = a.location.toLowerCase(),
            fb = b.location.toLowerCase();

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        }
        // Sorting according to price
        else if (this.sortOption == "price") {
          return a.price - b.price;
        }
        // Sorting according to spaces
        else if (this.sortOption == "stock") {
          return a.spaces - b.spaces;
        }
      });

      // Sorting according to ascending/descending order
      if (this.orderOption === "desc") {
        this.lessons.reverse();
      }
    },
  },
  // Number of lessons in the Cart
  computed: {
    cartItems: function () {
      return this.cart.length || "";
    },
   
    enableCheckoutButton: function () {
      var nameIsValid = this.validateNameInput();
      var phoneIsValid = this.validatePhoneInput();

      if (nameIsValid && phoneIsValid) {
        return true;
      }
      return false
    }
  },
  // User Details
  watch: {
    sortOption: function () {
      this.filteredLessons();
  },
  orderOption: function () {
      this.filteredLessons()
  },
    search: {
      handler(val) {
        
          if (val.trim() != '') {
              this.searchLessons(val);
          } else {
              this.fetchLessons();
          }
      },
  }
  },
});
