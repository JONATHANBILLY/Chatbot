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

//---------------------------------------------------------------------------RESPONSES-----------------------------------------------------------------------------------------//
    const time1 = new Date().setHours(12);
    const hours1 = new Date(time1).getHours();
    const time2 = new Date().setHours(15);
    const hours2 = new Date(time2).getHours();
    const time3 = new Date().setHours(18);
    const hours3 = new Date(time3).getHours();

    function greetingTime(currentHours){
      if(currentHours < hours1){
        return "pagi"
      } else if(currentHours < hours2){
        return "siang"
      } else if(currentHours < hours3){ 
        return "sore"
      } else{
        return "malam"
      }
    }
    
    function checkJadwal(jadwalDokter, dayOfWeek){
      const jadwalPraktek = new Array();

      jadwalDokter.forEach(function(element) {
        const hariDokterPrakter = new Array();
        element.hariPraktek.forEach(function (hari){
          hariDokterPrakter.push(hari.split(' ').shift());
        });
        jadwalPraktek.push(hariDokterPrakter);
      });

      const arrayKumpulanDokter = new Array();

      for(let i = 0; i < jadwalPraktek.length; i++){
        for(let j = 0; j < jadwalPraktek[i].length; j++){
            if(['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dayOfWeek] == jadwalPraktek[i][j]){
              arrayKumpulanDokter.push(jadwalDokter[i].no+". "+jadwalDokter[i].nama+"\n Jadwal praktek: \n"+jadwalDokter[i].hariPraktek.join('   \n'));
            }
        }
      }  
      return arrayKumpulanDokter.join('\n');
    }

rawat_inap()

const responses = {
  greetings: [
    'Halo selamat '+greetingTime(new Date().getHours())+', ada yang bisa kami bantu seputar informasi rumah sakit?', 'Selamat '+greetingTime(new Date().getHours())+' medika di sini, ada yang ingin ditanyakan seputar informasi rumah sakit?'
      ],
  alamat_rs: [
    'Alamat rs berada di Jl. Sultan Agung No.76 Bangorejo 68487, Banyuwangi-Jawa Timur, Telp. 0333-395016'
  ],
  selesai:[
    'Maaf Medika tidak mengenali pertanyan tersebut, mungkin dapat diperjelas lagi pertanyaan yang ditanyakan.'
  ],
  dokter:[
    { // create an array with existing objects
    no: 1,
    nama: "dr. Emilia Charles",
    hariPraktek: ["Senin : 08:00 - 12:00 dan 18:00 - 21:00", "Selasa : 08:00 - 12:00 dan 18:00 - 21:00", "Rabu : 08:00 - 12:00 dan 18:00 - 21:00", "Kamis : 08:00 - 12:00 dan 18:00 - 21:00", "Jumat : 08:00 - 12:00 dan 18:00 - 21:00", "Sabtu : 08:00 - 12:00", "Minggu : 18:00 - 21:00"]
  }, 
  { // create an array with existing objects
    no: 2,
    nama: "dr. Garinda Chaesaria",
    hariPraktek: ["Senin : 14:00 - 17:00", "Kamis : 14:00 - 17:00"]
  },
  { // create an array with existing objects
    no: 3,
    nama: "dr. Elisa Marsitin",
    hariPraktek: ["Jumat : 14:00 - 17:00", "Sabtu : 14:00 - 21:00", "Minggu : 07:00 - 14:00"]
  }
  ],
  rawat_inap:'',
  hari_libur:'Hari libur hanya hari besar saja.',
  end:'Terimakasih telah mengunjungi layanan chatbot rumah sakit kami, semoga informasi yang diberikan cukup jelas dan dapat membantu. Apakah ada pertanyaan lain yang ingin ditanyakan?'
}

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
  handleMessage: async (entities, traits) => {
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
    const hari_libur = firstValue(traits, 'hari_libur')
    const end = firstValue(traits, 'end')

    if (greetings) {
      const greet = responses['greetings']
      return greet[Math.floor(Math.random() * greet.length)]
    } else if (alamat_rs){
      const alamat_rs = responses['alamat_rs']
      return alamat_rs[0]
    } else if(dokter){
      const dokter = responses['dokter']
        const result = [];
        dokter.forEach(function(element) {
          result.push(element.no+". "+element.nama+"\n Jadwal praktek: \n"+element.hariPraktek.join('   \n'));
        });
        return result.join('\n');
    }else if (dokter_hari_ini) {
      const dokter_hari_ini = responses['dokter']
      const todayDate = new Date();
      const dayOfWeek = todayDate.getDay();
      return checkJadwal(dokter_hari_ini, dayOfWeek)
    }else if (dokter_hari_senin) {
      const dokter_hari_senin = responses['dokter']
      const dayOfWeek = 1;
      return checkJadwal(dokter_hari_senin, dayOfWeek)
    }else if (dokter_hari_selasa) {
      const dokter_hari_selasa = responses['dokter']
      const dayOfWeek = 2;
      return checkJadwal(dokter_hari_selasa, dayOfWeek)
    }else if (dokter_hari_rabu) {
      const dokter_hari_rabu = responses['dokter']
      const dayOfWeek = 3;
      return checkJadwal(dokter_hari_rabu, dayOfWeek)
    }else if (dokter_hari_kamis) {
      const dokter_hari_kamis = responses['dokter']
      const dayOfWeek = 4;
      return checkJadwal(dokter_hari_kamis, dayOfWeek)
    }else if (dokter_hari_jumat) {
      const dokter_hari_jumat = responses['dokter']
      const dayOfWeek = 5;
      return checkJadwal(dokter_hari_jumat, dayOfWeek)
    }else if (dokter_hari_sabtu) {
      const dokter_hari_sabtu = responses['dokter']
      const dayOfWeek = 6;
      return checkJadwal(dokter_hari_sabtu, dayOfWeek)
    }else if (dokter_hari_minggu) {
      const dokter_hari_minggu = responses['dokter']
      const dayOfWeek = 0;
      return checkJadwal(dokter_hari_minggu, dayOfWeek)
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
    }else if(hari_libur){
      const hari_libur = responses['hari_libur']
      return hari_libur
    }else if(end){
      const end = responses['end']
      return end
    }
     else {
      const selesai = responses['selesai']
      return selesai[0]
    }
  }
}

module.exports = nlp
