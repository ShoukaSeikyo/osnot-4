//#Channel;

Channel.get('patreon').dispatch('token', { token: JSON.parse(window.decodeURI(window.location.hash.slice(1)))});