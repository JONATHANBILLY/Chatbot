const mysql = require('mysql')
const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database: 'rsdb'
})

connection.connect(function(err) {
  if(err){
    console.log(`Error in the connection, with error ${err}`)
  }
  else{
    console.log(`Database Connected`)
  }
})

//----------------------------------------------------------------------------FUNCTION KONTAK-------------------------------------------------------------------------------//

function rawat_inap () {
  connection.query(`SELECT * FROM rawat_inap`, function (err, result) {
    const rawatinap = 'Berikut ini adalah daftar rawat inap beserta harga:'
    let listRawat = ''
    if(err){
      throw err
    }
    for (let index = 0; index < result.length; index++) {
      listRawat += `\n \n Kelas ${result[index].kelas} \n ${result[index].fasilitas} \n Rp. ${result[index].harga}`
    }
    responses.rawat_inap = `${rawatinap}${listRawat}`
  })
}

const time1 = new Date().setHours(12);
const hours1 = new Date(time1).getHours();
const time2 = new Date().setHours(15);
const hours2 = new Date(time2).getHours();
const time3 = new Date().setHours(18);
const hours3 = new Date(time3).getHours();

function greetingTime(currentHours){
  if(currentHours < hours1){
    return "pagi"
  } else if(currentHours == hours2 || currentHours < hours2){
    return "siang"
  } else if(currentHours < hours3){ 
    return "sore"
  } else{
    return "malam"
  }
}

const responses = {
  greetings: [
    'Halo selamat '+greetingTime(new Date().getHours())+', ada yang bisa kami bantu?', 'Selamat '+greetingTime(new Date().getHours())+' medika di sini, ada yang ingin ditanyakan?'
      ],
  alamat_rs: [
    'Alamat rs berada di Jl. Sultan Agung No.76 Bangorejo 68487, Banyuwangi-Jawa Timur, Telp. 0333-395016'
  ],
  selesai:[
    'Maaf Medika tidak mengenali pertanyan tersebut, mungkin dapat diperjelas lagi pertanyaan yang ditanyakan.'
  ],
  dokter:'',
  rawat_inap:''
}

function getDokter(dokter_hari_ini, dayOfWeek) {
  connection.query(`SELECT * FROM dokter`, function (err, result) {
    const listDokter = [];
    if(err) throw err;
    for (let i = 0; i < result.length; i++) {
      let dokters = {
        no : result[i].no,
        nama : result[i].nama,
        hariPraktek : result[i].hariPraktek
      };
      listDokter.push(dokters);
    }
    //console.log(dokter_hari_ini, dayOfWeek)
    responses.dokter = listDokter
    const hariIniString = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dayOfWeek];
    const praktekHariIni = []
  })
}

rawat_inap()
getDokter()

//---------------------------------------------------------------------------RESPONSES-----------------------------------------------------------------------------------------//

//analisa respon Wit.ai JSON, untuk menentukan trait atau entities milik siapa
const firstValue = (obj, key) => {
  const val =
    obj &&
    obj[key] &&
    Array.isArray(obj[key]) &&
    obj[key].length > 0 &&
    obj[key][0].value
  if (!val) {
    return null
  }
  return val
}
  
// Message handler section, (membandingkan hasil dari analisa dengan mengirimkan pesan)
var nlp = {
  handleMessage: async (_entities, traits) => {
    const greetings = firstValue(traits, 'wit_greetings')
    const alamat_rs = firstValue(traits, 'wit_kontak')
    const dokter = firstValue(traits, 'dokter')
    const dokter_hari_ini = firstValue(traits, 'dokter_hari_ini')
    const dokter_hari_senin = firstValue(traits, 'dokter_hari_senin')
    const dokter_hari_selasa = firstValue(traits, 'dokter_hari_selasa')
    const dokter_hari_rabu = firstValue(traits, 'dokter_hari_rabu')
    const dokter_hari_kamis = firstValue(traits, 'dokter_hari_kamis')
    const dokter_hari_jumat = firstValue(traits, 'dokter_hari_jumat')
    const dokter_hari_sabtu = firstValue(traits, 'dokter_hari_sabtu')
    const dokter_hari_minggu = firstValue(traits, 'dokter_hari_minggu')
    const dokter_emilia = firstValue(traits, 'dokter_emilia')
    const dokter_garinda = firstValue(traits, 'dokter_garinda')
    const dokter_elisa = firstValue(traits, 'dokter_elisa')
    const rawat_inap = firstValue(traits, 'rawat_inap')


    if (greetings) {
      const greet = responses['greetings']
      return greet[Math.floor(Math.random() * greet.length)]
    } else if (alamat_rs){
      const alamat_rs = responses['alamat_rs']
      return alamat_rs[0]
    } else if(dokter){
      const dokter = responses['dokter']
        const result = [];
        dokter.forEach(function(_element) {
          result.push(listDokter.no+". "+listDokter.nama+"\n Jadwal praktek: \n"+listDokter.hariPraktek.join('   \n'));
        });
        return result.join('\n');
    }else if (dokter_hari_ini) {
      const dokter_hari_ini = responses['dokter']
      const todayDate = new Date();
      const dayOfWeek = todayDate.getDay();
      console.log("ucup", responses)
      return
      // return getDokter(dokter_hari_ini, dayOfWeek)
    }else if (dokter_hari_senin) {
      const dokter_hari_senin = responses['dokter']
      const dayOfWeek = 0;
      return getDokter(dokter_hari_senin, dayOfWeek)
    }else if (dokter_hari_selasa) {
      const dokter_hari_selasa = responses['dokter']
      const dayOfWeek = 1;
      return getDokter(dokter_hari_selasa, dayOfWeek)
    }else if (dokter_hari_rabu) {
      const dokter_hari_rabu = responses['dokter']
      const dayOfWeek = 2;
      return getDokter(dokter_hari_rabu, dayOfWeek)
    }else if (dokter_hari_kamis) {
      const dokter_hari_kamis = responses['dokter']
      const dayOfWeek = 3;
      return getDokter(dokter_hari_kamis, dayOfWeek)
    }else if (dokter_hari_jumat) {
      const dokter_hari_jumat = responses['dokter']
      const dayOfWeek = 4;
      return getDokter(dokter_hari_jumat, dayOfWeek)
    }else if (dokter_hari_sabtu) {
      const dokter_hari_sabtu = responses['dokter']
      const dayOfWeek = 5;
      return getDokter(dokter_hari_sabtu, dayOfWeek)
    }else if (dokter_hari_minggu) {
      const dokter_hari_minggu = responses['dokter']
      const dayOfWeek = 6;
      return getDokter(dokter_hari_minggu, dayOfWeek)
    } else if(dokter_emilia){
      const dokter_emilia = responses['dokter']
      return dokter_emilia[0].no+". "+dokter_emilia[0].nama+"\n Jadwal praktek: \n"+dokter_emilia[0].hariPraktek.join('   \n')
    }else if(dokter_garinda){
      const dokter_garinda = responses['dokter']
      return dokter_garinda[1].no+". "+dokter_garinda[1].nama+"\n Jadwal praktek: \n"+dokter_garinda[1].hariPraktek.join('   \n')
    }else if(dokter_elisa){
      const dokter_elisa = responses['dokter']
      return dokter_elisa[2].no+". "+dokter_elisa[2].nama+"\n Jadwal praktek: \n"+dokter_elisa[2].hariPraktek.join('   \n')
    }else if (rawat_inap) {
      const rawat_inap = responses['rawat_inap']
      return rawat_inap
    }
     else {
      const end = responses['selesai']
      return end[0]
    }
  }
}

module.exports = nlp
