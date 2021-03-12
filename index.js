const { VK, resolveResource } = require('vk-io');
const fs = require('fs');

let writer
if(process.argv[3] == 'txt'){
	writer = fs.createWriteStream(process.argv[2].split('wall-')[1] + '.txt')
}

function log(data) {
	writer.write(data);
}

const vk = new VK({
	token: "" // b7b56d211761a25e5e6e8f...
});


async function getPostInfo() {
  const resource = await resolveResource({
    api: vk.api,
    resource: process.argv[2]
  });

  return await resource;
}

async function getLikesCount(owner_id, item_id) {
	user = await vk.api.call('likes.getList', {
		type: 'post',
		owner_id: owner_id,
		item_id: item_id,
		count: 1
	});

return await user.count;
}

async function getLikes(owner_id, item_id, count, skip) {
	users = await vk.api.call('likes.getList', {
		type: 'post',
		owner_id: owner_id,
		item_id: item_id,
		count: count,
		offset: skip
	});

return await users;
}

async function getUsersInfo(users) {

  const usersInfo = await vk.api.call('users.get', {
    user_ids: users,
    fields: 'sex, status, domain, city, country, education, bdate, last_seen, connections, schools'
  });

  return await usersInfo;
}

(async () => {
	skip = 0
  info = await getPostInfo()
	count = await getLikesCount(info.ownerId, info.id)
	for (var i = 0; i <= parseInt(await count / 1000); i++) {
		if(i == parseInt(await count / 1000)){
			usersCount = await count % 1000
		}
		else {
			usersCount = await 1000
		}
		skip = await i * 1000
		likes = await getLikes(info.ownerId, info.id, usersCount, skip)
		users = await getUsersInfo(likes.items)


		for (var a = 0; a < users.length; a++) {
			if(await users[a].sex == 1){
				if(await users[a].country == undefined){
					users[a].country = await {title: NaN}
				}
				if(await users[a].city == undefined){
					users[a].city = await {title: NaN}
				}
				if(users[a].city.title == 'Москва'){
					var platform
					if(users[a].last_seen){
						switch (users[a].last_seen.platform) {
							case 1:
							platform = 'Мобильный браузер'
								break;
							case 2:
							platform = 'iPhone'
								break;
							case 3:
							platform = 'iPad'
								break;
							case 4:
							platform = 'Android'
								break;
							case 5:
							platform = 'Windows Phone'
								break;
							case 6:
							platform = 'Windows 10'
								break;
							case 7:
							platform = 'Браузер'
								break;
							default:
							platrofm = NaN
								break;
						}
					}

					var age = new Date().getFullYear() - new Date(users[a].bdate).getFullYear();
					if((!users[a].schools) || (users[a].schools && !users[a].schools[0])){
						users[a].schools = [{name: 'NaN'}]
					}

					if(process.argv[3] == 'txt'){
						log(users[a].first_name + " | " + age.toString() + " | " + users[a].country.title + " | " + users[a].city.title + " | " + users[a].status + '\n');
						log(platform + " | " + users[a].university_name + " | " + users[a].schools[0].name + '\n');
						log('https://vk.com/' + users[a].domain + '\n\n');

					}
					else {
						console.log(users[a].first_name, "|", age.toString(), "|", users[a].country.title, "|", users[a].city.title, "|", users[a].status);
						console.log(platform, "|", users[a].university_name, "|", users[a].schools[0].name)
						console.log('https://vk.com/' + users[a].domain);
						console.log();
					}
				}
			}
		}
	}
})()
