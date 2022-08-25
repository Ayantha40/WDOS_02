//creating a constant for static cache
const statCache='statv7';
//creating a constant for dynamic cache
const dynaCache='dynav1';

//storing shell/static assets in an array
const assets=['./', 'Fall Back.html','fallback.css','0shste1dnbi21.webp', '02.webp','4d5f073538b951bee93e2a8a2b0435c4.webp','4e2d2066ecc1914620211a01fb159e99.webp','07.webp','12.webp','832048x2026.webp','1489658697kumana_park_new_5.webp','1596629554_shutterstock_1072567361.jpg.webp','4332766586_cce77290f7_b.webp','15251719134_ae07fc2ee2_o.webp','27052635428_e363a20946_b.webp','43149693702_9ec7c6577c_b.webp','activities.css','Activities.html','activities.js','AdamsPeakSriLanka.webp', 'Adventure.webp','amaravilla01.webp','androidchrome192x192.png','appletouchicon.png','b3.webp','b4.webp','b5.webp','b6.webp','b7.webp','b8.webp', 'b10.webp','b11.webp','b12.webp','b13.webp','b14.webp','beaches.css','Beaches.html','bg.webp','blacktea.webp','bottom_img_01.webp','bt.webp','Cinnamontea.webp','climbing.webp','ct1.webp','dalada2.webp','dambullac.webp','Donation.webp','donations.css','donations.js','ds.webp','e5f6a5b3b3aa0310e7887110067f6147.webp','e2665d2e9b956e0942dc935a18e74103.jpg','EarlsRegent.webp','ele.jpg','eykd3k.webp','favicon.ico','favicon16x16.png','favicon32x32.png','foto_no_exif-46.webp','galle.webp','gems.webp','goodbatik.webp','greentea.webp','h1.webp','h2o.webp','heri1.webp','heribun.webp','Heritage Location 1.html','Heritage Location 2.html','heritage1.css','heritage2.css','hero1.webp','ho.jpg','Home Page.html','homepage.css','HotAir Ballooning.webp','Hotel Contact.html','hotel.css','IMG_0720.webp','Island8.webp','jeetha.webp','kaka.webp','Kala.webp','KatharagamaFestival.webp','kovil.jpg','L1.webp','large.webp','location.css','Location.html','main.js','manifest.json','mask.png','maxresdefault (1).webp','maxresdefault (2).webp','maxresdefault.webp','mstile150x150.png','MWW.webp','nelum.jpg','nightlife.webp','owl.jpg','safaripinnedtab.svg','Screen-Shot-2020-11-26-at-11.40.55-AM.webp','Screenshot_20211210-103030_Facebook.jpg','shutterstock_774559867.1920x1080.webp','Sig.jpg','sigiriya.jpg','siri.jpg','site.webmanifest','sri_lanka_night_life-820x394.webp','SriLanka Maniumpathy.webp','sustainableinvestments.webp','TouristAttractionsinSriLanka2.webp','UNAVATUN013.webp','ulagalla_resort_sri_lanka.webp','up.jpg','w1.webp','w2.webp','w4.webp','w5.webp','w6.webp','w7.webp','w8.webp','w9.webp','Wasgamuwa.jpg','wata.webp','water.jpg','Web Site Logo.png','whale.webp','Wildlife Attractions.html','wildlife.css','ya.jpg','yapa.jpg','yapahuwa.webp','yapahuwa2.webp','YapahuwaRockFortress.webp','YapahuwaRockFortress4.webp', 'Store.html','Store.css','Store.js'];

//the install event
self.addEventListener('install',(evt)=>{
    //console.log("Service worker installed.");
    //install event should wait until whatever inside evt.waitUntil() finishes.
    evt.waitUntil(
        //open static cache
        caches.open(statCache)
    .then((cache)=>{
        console.log("Caching assets...");
        //adding all assets in assets array into cache
        cache.addAll(assets);
    })
    );
    
});

//The activate event
self.addEventListener('activate',(evt)=>{
    //console.log("Service worker is active!");
    evt.waitUntil(
        //accessing all versions of caches available currently
        caches.keys()
        .then((keys)=>{
            //console.log(keys);
            //going through the list pf caches, checking whether the cache name is equal to current cache version/s:static and dynamic and getting rid of any old cache versions
            return Promise.all(
                keys.filter(key=>key!==statCache && key!==dynaCache)
                .map(key=>caches.delete(key))
            );

        })
    );
});

//The fetch event handler
self.addEventListener('fetch',(evt)=>{
    //console.log("Fetch event",evt);
    //interrupt the normal request and respond with a custom response
    evt.respondWith(
        //check if the resource exists in cache
        caches.match(evt.request)
        .then((cacheRes)=>{
            //return from cache if it is there in cache. or else fetch from server
            return cacheRes || fetch(evt.request)
            //when fetching from server, add the request and response to dynamic cache to access the resource/s when offline
            .then(fetchRes=>{
                return caches.open(dynaCache)
                .then(cache=>{
                    cache.put(evt.request.url,fetchRes.clone());
                    return fetchRes;
                });
            });
            //returning the fallback page if the resource is not available in any of the caches
        }).catch(()=>{
            //check whether the request url contains .html in it
            if(evt.request.url.indexOf('.html')>-1){
                return caches.match('/fallback.html')
            }
            })
    );
})