import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

const createSocket = (topicId) => {
  let channel = socket.channel(`comments:${topicId}`, {})
  channel.join()
    .receive("ok", resp => renderComments(resp))
    .receive("error", resp => { console.log("Unable to join", resp) });

  channel.on(`comments:${topicId}:new`, renderComment)

  document.querySelector('button').addEventListener('click', () => {
    const content = document.querySelector('textarea').value;

    channel.push('comment:add', { content });
  });
};

function renderComments({comments}) {
  const renderedComments = comments.map(comment => commentTemplate(comment)).join('');

  document.querySelector('.collection').innerHTML = renderedComments;
}

function renderComment({comment}) {
  const renderedComment = commentTemplate(comment);

  document.querySelector('.collection').innerHTML += renderedComment;
}

function commentTemplate(comment) {
  return `<li class="collection-item">${comment.content}</li>`;
}

window.createSocket = createSocket;
