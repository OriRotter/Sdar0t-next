function inject(source) {
	// inject JS in order to retrieve page variables and communicate with them
	const j = document.createElement('script'), f = document.getElementsByTagName('script')[0];
	j.textContent = source
	f.parentNode.insertBefore(j, f)
	f.parentNode.removeChild(j)
}


function mainCode()
{
	console.log("runed")
	let btn = document.createElement("button");
	btn.innerHTML = "לצפייה";
	btn.id = "nextOne";
	btn.style.fontSize = "20px"
	btn.className = "btn btn-blue";
		btn.onclick = function () 
	{
	  btnClick();
	};
	document.querySelector("#watchEpisode > div.content > div > div.col-lg-3.col-md-4.col-sm-5.col-xs-12 > div:nth-child(3) > div:nth-child(6)").appendChild(btn);


	console.log("runed2")
	const play = document.getElementById('proceed');
	play.addEventListener('click', (event) => 
	{
		let next = document.createElement("button");
		next.innerHTML = "פרק הבא";
		next.id = "next";
		next.style.fontSize = "20px"
		next.className = "btn btn-lg btn-gray disabled";
		document.querySelector("#player > div.content > div.row > div.col-xl-6.col-lg-8.col-md-5.col-sm-7.col-xs-12.text-center > div").appendChild(next);
		console.log("checking time");
		timerCheck();
	})

	
	function httpGet(SID,SE)
	{
		theUrl = "https://www.sdarot.tw/ajax/watch?episodeList="+SID+"&season="+SE
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
		xmlHttp.send( null );
		var httpText = xmlHttp.responseText;
		var httpTextArr = httpText.split(">"); 
		var lastEf = httpTextArr[httpTextArr.length-5]
		lastEf = lastEf.replaceAll('</a','');
		return lastEf;
	}
	
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	  }

	function timerCheck()
	{
		var timerID = setInterval(function() 
		{
			let current = parseInt(document.getElementsByClassName("vjs-current-time-display")[0].innerHTML.split(":")[0]);
			let duration = parseInt(document.getElementsByClassName("vjs-duration-display")[0].innerHTML.split(":")[0]);
			console.log(current+':'+duration);
			if(duration/current <= 1.4)
			{
				console.log("Getting next!");
				requestNextEpi();
				clearInterval(timerID);
				
			}
		}, 60 * 1000); 
	}

	function getNextEpisode()
	{
		var S,E;
		try
		{
			var sizeS = Object.keys(watched).length;
			for (S = 1;S<=sizeS;S++)
			{
				console.log(S)
				var sizeE = Object.keys(watched[S]).length;
				if(sizeE == 0)
				{
					S = S-1
					var ep = 1+Object.keys(watched[S]).length++;
					var lastEp = httpGet(SID,S);
					if(ep > lastEp)
					{
						return [S+1,1];
					}
					return [S,ep];
				}
			}
		}
		catch(e)
		{
			
		}
		return [1,1];
	}

	async function firstPost(SID,SE,EP)
	{
		var data = await fetch("https://www.sdarot.tw/ajax/watch", 
		{
			"headers": 
			{
				"accept": "*/*",
				"accept-language": "he-IL,he;q=0.9",
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": "\"Windows\"",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"x-requested-with": "XMLHttpRequest"
			},
			"referrer": "https://www.sdarot.tw/",
			"referrerPolicy": "strict-origin",
			"body": 'preWatch=true&SID='+SID+'&season='+SE+'&ep='+EP,
			"method": "POST",
			"mode": "cors",
			"credentials": "include"
		})
		.then((response) =>response.text())
		.then(data=>
			{ 
				return data;
			})
			.catch(error => {
				console.error(error);
			});
		return data;
	}
	
	function secPost()
	{
		fetch("https://www.sdarot.tw/ajax/watch", 
		{
			"headers": 
			{
				"accept": "*/*",
				"accept-language": "he-IL,he;q=0.9",
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": "\"Windows\"",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"x-requested-with": "XMLHttpRequest"
			},
			"referrer": "https://www.sdarot.tw/",
			"referrerPolicy": "strict-origin",
			"body": "vast=true",
			"method": "POST",
			"mode": "cors",
			"credentials": "include"
			})
	}

	async function lastPost(token,SID,SE,EP)
	{
		var data = await fetch("https://www.sdarot.tw/ajax/watch", 
		{
			"headers": 
			{
				"accept": "application/json, text/javascript, */*; q=0.01",
				"accept-language": "he-IL,he;q=0.9",
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": "\"Windows\"",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-origin",
				"x-requested-with": "XMLHttpRequest"
			},
			"referrer": "https://www.sdarot.tw/",
			"referrerPolicy": "strict-origin",
			"body": 'watch=true&token='+token+'&serie='+SID+'&season='+SE+'&episode='+EP+'&type=episode',
			"method": "POST",
			"mode": "cors",
			"credentials": "include"
			})
			.then((response) =>response.json())
			.then(data=>
				{ 
					return data;
				})
				.catch(error => {
					console.error(error);
				});
			return data;
	}

	var link = "aa";
	var SI
	var SE 
	var EP 
	async function requestNextEpi()
	{
		SI = SID;
		SE = parseInt(season);
		EP = parseInt(episode)+1;
		var lastEp = httpGet(SID,SE);
		if(lastEp < EP)
		{
			if(document.querySelectorAll('[data-season]').length > SE)
			{
				EP = 1;
				SE += 1;
			}
			else
			{
				alarm("סיימת תסדרה");
				return;
			}
		}
		var t = await firstPost(SI,SE,EP)
		console.log(t);
		await sleep(31000)
		secPost();
		link = await lastPost(t,SI,SE,EP);
		console.log("Got next one!")
		var change = document.getElementById("next");
		change.className = "btn btn-lg btn-gray";
		change.onclick = function () 
		{
		  	putNext();
		};
		var checkPro = setInterval(function() 
		{
			let progress = parseInt(document.getElementsByClassName("vjs-play-progress vjs-slider-bar")[0].style["width"].replaceAll('%',''));
			if(progress >= 100)
			{
				document.querySelector("#videojs > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-playing").click()
				clearInterval(checkPro);
			}
		}, 1 * 1000);
	}

	function putNext()
	{
		console.log(link)
		document.querySelector("#player > div.head > p").innerHTML = link["heb"]+" / "+link["eng"]+" - עונה "+SE+" פרק "+EP;
		document.querySelector("#description").innerHTML = link["description"];
		document.querySelector("#date").innerHTML = link["addDate"];
		document.querySelector("#views").innerHTML = link["viewnumber"];
		document.querySelector("#videojs_html5_api").src = link["watch"]["480"];
		document.querySelector("#videojs > div:nth-child(8)").innerHTML = Sname[2]+" עונה "+SE+" פרק "+EP;
		link = "";
		console.log("checking time");
		timerCheck();

	}
	function btnClick()
	{
		var rData = getNextEpisode();
		var SE = rData[0];
		var EP = rData[1];
		console.log(SE+":"+EP);
		var sURL = "https://www.sdarot.tw/watch/"+SID+"/season/"+SE+"/episode/"+EP;
		window.location.href = sURL;
	}
}

inject(mainCode.toString() + "; mainCode()");