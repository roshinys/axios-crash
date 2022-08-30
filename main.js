//global
axios.defaults.headers.Authorization = "sometoken";

// GET REQUEST
function getTodos() {
  console.log("GET Request");
  //method 1 the hard way
  // axios({
  //   method: "get",
  //   url: "https://jsonplaceholder.typicode.com/todos",
  //   params: {
  //     _limit: 5,
  //   },
  // }).then((res) => {
  //   showOutput(res);
  // }).catch((err)=>{
  // console.log(err)
  // });

  //method 2
  axios
    .get("https://jsonplaceholder.typicode.com/todos", {
      params: { _limit: 5 },
      timeout: 5000,
    })
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// POST REQUEST
function addTodo() {
  console.log("POST Request");
  axios
    .post("https://jsonplaceholder.typicode.com/todos", {
      title: "new todo",
      completed: false,
    })
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// PUT/PATCH REQUEST
function updateTodo() {
  console.log("PUT/PATCH Request");

  const id = 1;
  axios
    .patch("https://jsonplaceholder.typicode.com/todos/" + id, {
      title: "updated todo",
      completed: true,
    })
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// DELETE REQUEST
function removeTodo() {
  console.log("DELETE Request");
  const id = 1;
  axios
    .delete("https://jsonplaceholder.typicode.com/todos/" + id)
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// SIMULTANEOUS DATA
function getData() {
  console.log("Simultaneous Request");
  axios
    .all([
      axios.get("https://jsonplaceholder.typicode.com/posts?_limit=5"),
      axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5"),
    ])
    .then(
      axios.spread((posts, todos) => {
        console.log(todos);
        showOutput(posts);
      })
    )
    .catch((err) => {
      console.log(err);
    });
}

// CUSTOM HEADERS
function customHeaders() {
  console.log("Custom Headers");
  const newconfig = {
    headers: {
      "Content-type": "application-json",
      Authorization: "SomeToken",
    },
  };
  axios
    .post(
      "https://jsonplaceholder.typicode.com/todos",
      {
        title: "todo 2",
        completed: false,
      },
      newconfig
    )
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  console.log("Transform Response");
  const options = {
    method: "post",
    url: "https://jsonplaceholder.typicode.com/todos",
    data: {
      title: "Hello World",
      completed: false,
    },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase();
      return data;
    }),
  };
  axios(options)
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// ERROR HANDLING
function errorHandling() {
  console.log("Error Handling");
  axios
    .get("https://jsonplaceholder.typicode.com/todoss", {
      validateStatus: (status) => {
        return status < 500;
      },
    })
    .then((res) => {
      showOutput(res);
    })
    .catch((err) => {
      if (err.response) {
        //other than 200 range
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        if (err.response.status == 404) {
          alert("not a great page to view");
        }
      } else if (err.request) {
        //request made no response
        console.log(err.request);
      } else {
        console.log(err);
      }
    });
}

// CANCEL TOKEN
function cancelToken() {
  console.log("Cancel Token");
  const cancelToken = axios.CancelToken;
  const source = cancelToken.source();
  axios
    .get("https://jsonplaceholder.typicode.com/todos?_limit=5", {
      cancelToken: source.token,
    })
    .then((res) => {
      showOutput(res);
    })
    .catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log("request cancelled!", thrown.message);
      }
    });
  if (true) {
    source.cancel("request cancelled!");
  }
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(
  (config) => {
    console.log(
      ` ${config.method.toUpperCase()} request sent to ${
        config.url
      } at ${new Date().getTime()}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AXIOS INSTANCES
const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/",
});
// axiosInstance.get("/comments?_limit=5").then((res) => {
// showOutput(res);
// });

// Show output in browser
function showOutput(res) {
  document.getElementById("res").innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById("get").addEventListener("click", getTodos);
document.getElementById("post").addEventListener("click", addTodo);
document.getElementById("update").addEventListener("click", updateTodo);
document.getElementById("delete").addEventListener("click", removeTodo);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", customHeaders);
document
  .getElementById("transform")
  .addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);
