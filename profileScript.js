SetUpUI()
getUser()
getPosts()

function getCurrentUserId(){
    // بتجيب الquary parameters وبتستخرج منها ال id
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("userid")
    return id
}
function getUser(){

    const id =getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}`)
    .then(function (response) {
        console.log(response.data)
        const user =response.data.data
        document.getElementById("main-info-email").innerHTML=user.email
        document.getElementById("main-info-name").innerHTML=user.name
        document.getElementById("main-info-username").innerHTML=user.username
        document.getElementById("main-info-image").src =user.profile_image
        document.getElementById("name-posts").innerHTML =`${user.username}'s`



        // post & comments count
        document.getElementById("posts-count").innerHTML=user.posts_count
        document.getElementById("comments-count").innerHTML=user.comments_count

    })
}

function getPosts() {
    // داله ال get بترجع promise
    const id =getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}/posts`)
        .then(function (response) {
            const posts = response.data.data
            document.getElementById("user-posts").innerHTML=""
            for (post of posts) {
                const author = post.author
                let postTitle = ""

                // show or hide (edit) button
                let user =getCurrentUser()
                let isMypost= user != null && post.author.id ==user.id
                let editBtnContent=``

                if(isMypost){
                    editBtnContent=`
                    <button class="btn btn-danger" style=" margin-left:5px; float:right;" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
                    <button class="btn btn-secondary"style="float:right" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
                    `
                }
                if (post.title != null) {
                    postTitle = post.title
                }
                let content = `
                                    <div class="card shadow my-3">
                                        <div class="card-header">
                                            <img style="width: 40px;height: 40px; border-radius: 50%;" class="border border-2"src="${author.profile_image}">
                                            <b>${author.username}</b>

                                            ${editBtnContent}
                                        </div>
                                        <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer;">
                                            <img style="width: 100%; height: 200px;" src="${post.image}">
                                            <h6 style="color: rgba(25, 23, 23, 0.603); margin-top: 3px;">
                                                ${post.created_at}
                                                </h6>
                                            <h5>
                                                ${postTitle}
                                            </h5>
                                            <p>
                                                ${post.body}
                                            </p>
                                            <hr>
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                        class="bi bi-pencil" viewBox="0 0 16 16">
                                                        <path
                                                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                                </svg>
                                                <span>
                                                    (${post.comments_count})comment
                                                </span>
                                                <span id="post-tags">

                                                </span>
                                            </div>
                                        </div>
                                    </div>
            
            `
                document.getElementById("user-posts").innerHTML += content

                // todo tags
                //     const currentPostTagsId=`post-tags-${post.id}`
                //     document.getElementById(currentPostTagsId).innerHTML= ""
                //     for(tag of post.tags){
                //         console.log(tag.name)

                //         let tagsContent =`
                //         <button class="btn btn-sm rounded-5 " style="background-color: gray; color:white;">
                //             ${tag.name}
                //         </button>
                //         `
                //         document.getElementById(currentPostTagsId).innerHTML+=tagsContent
                //     }
            }
        })
}