
const baseUrl = "https://tarmeezacademy.com/api/v1"

// ===========POST REQUESTS========
function deletePostBtnClicked(postObject){
    
    // ال postObject هو ال المتغير الي بستلم فيه القيمه من ال html
    let post =JSON.parse(decodeURIComponent(postObject))

    document.getElementById("delete-post-id-input").value=post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    // toggle=> بتفتح البوسط اذا كان مقفول وبتقفله اذا كان مفتوح
    postModal.toggle()
}


function confirmPostDelete(){
    const postId=document.getElementById("delete-post-id-input").value
    const url = `${baseUrl}/posts/${postId}`
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${localStorage.getItem("token")}`
    }
    axios.delete(url,{
        headers:headers
    })
        .then((response) => {
            const modal = document.getElementById("delete-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("the post has been deleted successfully", "success")
            // هستدعي هذه ال function عشان محتجش بعد اضافه اي post اعمل refrash للصفحه 
            getPosts()
        })
        .catch((error)=>{
            const message = error.response.data.message
            showAlert(message, "danger")
        })
}

// وظيفه الداله دي انها هتاخد نفس ال modal بتاع create وتعدل عليه بحيث تستخدمو لل button بتاع ال edit
function editPostBtnClicked(postObject)
{
    
    // ال postObject هو ال المتغير الي بستلم فيه القيمه من ال html
    let post =JSON.parse(decodeURIComponent(postObject))
    
    document.getElementById("post-modal-submit-btn").innerHTML="update"
    document.getElementById("post-id-input").value=post.id
    document.getElementById("post-modal-title").innerHTML="Edit Post"
    document.getElementById("post-title-input").value=post.title
    document.getElementById("post-body-input").value=post.body
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    // toggle=> بتفتح البوسط اذا كان مقفول وبتقفله اذا كان مفتوح
    postModal.toggle()
    
}


function CreateANewPostClicked() {
    let postId = document.getElementById("post-id-input").value
    let iscreate=postId ==null || postId == ""

    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const image = document.getElementById("post-image-input").files[0]
    // الصوره بتتبعت في formfactor وليس JSON
    // هذا المتغير هو object من كلاس FormData()
    let formData = new FormData()
    formData.append("body", body)
    formData.append("title", title)
    formData.append("image", image)



    let url=``
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${localStorage.getItem("token")}`
    }
    // create
    if (iscreate){
            url=`${baseUrl}/posts`
    // edit
    }else{
            formData.append("_method","put")
            url=`${baseUrl}/posts/${postId}`
    }

    // لازم يكون هنا في object بداخله ال key الي اسمه headers وال value الي اسمه header
    toggleLoader(true)
    axios.post(url, formData, {
        headers: headers
    })
        .then((response) => {
            toggleLoader(false)
            const modal = document.getElementById("create-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("New Post Has Been Created successfuly", "success")
            // هستدعي هذه ال function عشان محتجش بعد اضافه اي post اعمل refrash للصفحه 
            getPosts()

        })
        .catch((error) => {
            const message = error.response.data.message
            showAlert(message, "danger")
        })
        .finally(()=>{
            toggleLoader(false)
        })

}

// Auth functions
function SetUpUI() {
    const token = localStorage.getItem("token")
    const loginDiv = document.getElementById("loggedin-div")
    const logoutDiv = document.getElementById("logout-div")
    const addBtn = document.getElementById("add-btn")

    if (token == null) {//user is guest (not logged in )

        if(addBtn !=null){
        addBtn.style.setProperty("display", "none", "important")
        }
        loginDiv.style.setProperty("display", "flex", "important")
        logoutDiv.style.setProperty("display", "none", "important")
    } else { //for logged in user

        if(addBtn != null){
        addBtn.style.setProperty("display", "flex", "important")
        }
        loginDiv.style.setProperty("display", "none", "important")
        logoutDiv.style.setProperty("display", "flex", "important")

        const user = getCurrentUser()
        document.getElementById("nav-username").innerHTML = user.username
        document.getElementById("nav-user-image").src = user.profile_image

    }
}


function loginBtnClicked() {
    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value
    const params =
    {
        "username": username,
        "password": password
    }
    const url = `${baseUrl}/login`
    toggleLoader(true)
    axios.post(url, params)
    .then((response) => {
            toggleLoader(false)
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            // عشان ال modal يتقفل تلقائي بعد التسجيل الدخول من خلاله
            const modal = document.getElementById("login-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("logged in successfuly", "success")
            SetUpUI()
        })
        .catch((error) => {
            const message = error.response.data.message
            showAlert(message, "danger")
        })
        .finally(()=>{
            toggleLoader(false)
        })

}



function RegesterBtnClicked() {
    const username = document.getElementById("regester-username-input").value
    const password = document.getElementById("regester-password-input").value
    const name = document.getElementById("regester-name-input").value
    const image = document.getElementById("regester-image-input").files[0]

    let formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("image", image)

    const url = `${baseUrl}/register`
    const headers = {
        "Content-Type": "multipart/form-data",
    }
    toggleLoader(true)
    axios.post(url, formData, {
        headers: headers
    })
        .then((response) => {
            toggleLoader(false)
            console.log(response.data)
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            // عشان ال modal يتقفل تلقائي بعد التسجيل الدخول من خلاله
            const modal = document.getElementById("regester-modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("New User Regestered successfuly", "success")
            SetUpUI()
        }).catch((error) => {
            const message = error.response.data.message
            showAlert(message, "danger")
        })
        .finally(()=>{
            toggleLoader(false)
        })
}



function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem("user")
    showAlert("logged out successfully")
    SetUpUI()
}



function showAlert(customemassage, type = "success") {

    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    appendAlert(customemassage, type)

    //todo: hide th alert
    setTimeout(() => {
        const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
        // alertToHide.hide()
    }, 3000);

}





// الداله دي هتجبلي معلومات اليوزر كامله
function getCurrentUser() {
    let user = null

    // بتحول العنصر من string الي Json
    // والي هيتحول هو ال storageUser
    const storageUser = localStorage.getItem("user")
    if (storageUser != null) {
        user = JSON.parse(storageUser)
    }

    return user
}


// هتجيب المستخدم الي مسجل دخوله
function profileClicked(){
    const user =getCurrentUser()
    const userId=user.id
    window.location=`profile.html?userid=${userId}`
}


// toggle => معناه لو كان شغال اخفيه ولو كان مخفي اظهره 
function toggleLoader(show=true)
{
    if(show){
        document.getElementById("loader").style.visibility='visible'
    }else{
        document.getElementById("loader").style.visibility='hidden'
    }
}