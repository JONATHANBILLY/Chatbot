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

const responses = {
    greetings: [
      'Halo selamat '+greetingTime(new Date().getHours())+', ada yang bisa kami bantu seputar informasi rumah sakit?', 'Selamat '+greetingTime(new Date().getHours())+' medika di sini, ada yang ingin ditanyakan seputar informasi rumah sakit?'
        ],
    alamat_rs: {
      alamat:'Alamat Rumah Sakit berada di Jl. Sultan Agung No.76 Bangorejo 68487, Banyuwangi-Jawa Timur, Telp. 0333-395016',
      no_telp:'0333-395016'
    },
    selesai:[
      'Maaf Medika tidak mengenali pertanyan tersebut mungkin dapat diperjelas lagi pertanyaan yang ingin ditanyakan.'
    ],
    dokter:[],
    namaDokter:{
      emilia:'',
      garinda:'',
      elisa:'',
    },
    rawat_inap:'',
    website:'https://www.ukdw.ac.id/',
    hari_libur:'Tidak ada pelayanan di hari libur nasional.',
    end:'Terimakasih telah mengunjungi layanan chatbot rumah sakit kami, semoga informasi yang diberikan cukup jelas dan dapat membantu. Apakah ada pertanyaan lain yang ingin ditanyakan?',
    fasilitas:'terdapat 5 kursi roda, toilet umum, rawat inap, dan UGD maupun IGD',
    dokter_spesialis:'Maaf dokter spesialis belum tersedia',
    pendaftaran:'Jika BPJS bisa datang langsung dan menyertakan fotokopi KK dan KTP serta fotokopi kartu BPJS, Jika mendaftar tanpa BPJS sihlakan langsung datang dan registrasi di rumah sakit'
  }

async function rawat_inap () {
  connection.query(`SELECT * FROM rawat_inap`, function (err, result) {
    const rawatinap = 'Berikut ini adalah daftar rawat inap beserta harga:'
    let listRawat = ''
    if(err){
      throw err
    }
    for (let index = 0; index < result.length; index++) {
      listRawat += `\n \n Kelas ${result[index].kelas} 5 Kamar \n ${result[index].fasilitas} \n Rp. ${result[index].harga}`
    }
    responses.rawat_inap = `${rawatinap}${listRawat}`
  })
}

function getDokter() {
  return new Promise(function(resolve, reject) {
    connection.query(`SELECT * FROM dokter`, function(err, result) {
      if (err) {
        reject(err);
      } else {
        const listDokter = [];
        for (let i = 0; i < result.length; i++) {
          let dokters = {
            no: result[i].no,
            nama: result[i].nama,
            hariPraktek: result[i].hariPraktek.split(',')
          };
          listDokter.push(dokters);
        }
        resolve(listDokter);
      }
    });
  });
}

function getDokterEmilia() {
  return new Promise(function(resolve, reject) {
    connection.query(`SELECT * FROM dokter WHERE no = 1`, function(err, result) {
      if (err) {
        reject(err);
      } else {
        const listDokter = [];
        for (let i = 0; i < result.length; i++) {
          let dokters = {
            no: result[i].no,
            nama: result[i].nama,
            hariPraktek: result[i].hariPraktek.split(',')
          };
          listDokter.push(dokters);
        }
        resolve(listDokter);
      }
    });
  });
}

function getDokterGarinda() {
  return new Promise(function(resolve, reject) {
    connection.query(`SELECT * FROM dokter WHERE no = 2`, function(err, result) {
      if (err) {
        reject(err);
      } else {
        const listDokter = [];
        for (let i = 0; i < result.length; i++) {
          let dokters = {
            no: result[i].no,
            nama: result[i].nama,
            hariPraktek: result[i].hariPraktek.split(',')
          };
          listDokter.push(dokters);
        }
        resolve(listDokter);
      }
    });
  });
}

function getDokterElisa() {
  return new Promise(function(resolve, reject) {
    connection.query(`SELECT * FROM dokter WHERE no = 3`, function(err, result) {
      if (err) {
        reject(err);
      } else {
        const listDokter = [];
        for (let i = 0; i < result.length; i++) {
          let dokters = {
            no: result[i].no,
            nama: result[i].nama,
            hariPraktek: result[i].hariPraktek.split(',')
          };
          listDokter.push(dokters);
        }
        resolve(listDokter);
      }
    });
  });
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
              const stringJadwal = ""+jadwalDokter[i].hariPraktek;
              const targetSubstring = jadwalPraktek[i][j];
              const splitArray = stringJadwal.split(",");
              let trimmedString = "";
              for (const item of splitArray) {
                if (item.startsWith(targetSubstring)) {
                  trimmedString = item;
                  break;
                }
              }
              arrayKumpulanDokter.push(jadwalDokter[i].no+". "+jadwalDokter[i].nama+"\n Jadwal praktek: \n"+trimmedString+"\n");
            }
        }
      } 
      return arrayKumpulanDokter.join('\n');
    }

rawat_inap()
getDokter().then(function(listDokter) {
  responses.dokter = listDokter;
}).catch(function(err) {
  console.error(err);
});
getDokterEmilia().then(function(emilia) {
  responses.namaDokter.emilia = emilia;
}).catch(function(err) {
  console.error(err);
});
getDokterGarinda().then(function(garinda) {
  responses.namaDokter.garinda = garinda;
}).catch(function(err) {
  console.error(err);
});
getDokterElisa().then(function(elisa) {
  responses.namaDokter.elisa = elisa;
}).catch(function(err) {
  console.error(err);
});

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


var nlp = {
  handleMessage: async (entities, traits) => {
    const greetings = firstValue(traits, 'greetings')
    const dokter_hari_ini = firstValue(traits, 'dokter_hari_ini')
    const hariPraktek = firstValue(entities, 'hariPraktek:hariPraktek')
    const libur = firstValue(traits, 'libur')
    const end = firstValue(traits, 'end')
    const pendaftaran = firstValue(traits, 'pendaftaran')
    const rawat_inap = firstValue(traits, 'rawat_inap')
    const fasilitas = firstValue(traits, 'fasilitas')
    const namaDokter = firstValue(entities,'namaDokter:namaDokter')
    const namaRS = firstValue(entities, 'namaRS:namaRS')
    const dokter = firstValue(traits, 'dokter')
    const alamat = firstValue(traits, 'alamat')
    const notlp = firstValue(traits, 'notlp')
    const website = firstValue(traits, 'website')

    if (greetings) {
      const greet = responses['greetings']
      return greet[Math.floor(Math.random() * greet.length)]
    } else if(dokter){
        const dokter = responses['dokter']
        const result = [];
        dokter.forEach(function (element) {
          result.push(element.no + ". " + element.nama + "\n Jadwal praktek: \n" + element.hariPraktek.join('   \n'));
        });
        return result.join('\n');
    }else if (dokter_hari_ini) {
      const dokter_hari_ini = responses.dokter
      const todayDate = new Date();
      const dayOfWeek = todayDate.getDay();
      return checkJadwal(dokter_hari_ini, dayOfWeek)
    }else if(hariPraktek){
      switch (hariPraktek.toLowerCase()){
        case 'senin':
          const hariSenin = responses.dokter
          return checkJadwal(hariSenin, 1)
        case 'selasa':
          const hariSelasa = responses.dokter
          return checkJadwal(hariSelasa, 2)
        case 'rabu':
          const hariRabu = responses.dokter
          return checkJadwal(hariRabu, 3)
        case 'kamis':
          const hariKamis = responses.dokter
          return checkJadwal(hariKamis, 4)
        case 'jumat':
          const hariJumat = responses.dokter
          return checkJadwal(hariJumat, 5)
        case 'sabtu':
          const hariSabtu = responses.dokter
          return checkJadwal(hariSabtu, 6)
        case 'minggu':
          const hariMinggu = responses.dokter
          return checkJadwal(hariMinggu, 0)
      }
    }else if (pendaftaran){
      const pendaftaran = responses['pendaftaran']
      return pendaftaran
    }else if(alamat){
      const alamat = responses['alamat_rs'].alamat
      return alamat
    }else if(notlp){
      const notlp = responses['alamat_rs'].no_telp
      return notlp
    }else if(rawat_inap) {
      const rawat_inap = responses['rawat_inap']
      return rawat_inap
    }else if(libur){
      const libur = responses['hari_libur']
      return libur
    }else if (fasilitas) {
      const fasilitas = responses['fasilitas']
      return fasilitas
    }else if(end){
      const end = responses['end']
      return end
    }else if (namaDokter) {
      switch (namaDokter.toLowerCase()) {
        case 'emilia':
          const dokterEmilia = responses['namaDokter'].emilia
          return dokterEmilia[0].nama+"\nJadwal praktek: \n"+dokterEmilia[0].hariPraktek.join('   \n')
        case 'garinda':
          const dokterGarinda = responses['namaDokter'].garinda
          return dokterGarinda[0].nama+"\nJadwal praktek: \n"+dokterGarinda[0].hariPraktek.join('   \n')
        case 'elisa':
          const dokterElisa = responses['namaDokter'].elisa
          return dokterElisa[0].nama+"\nJadwal praktek: \n"+dokterElisa[0].hariPraktek.join('   \n')
        case 'spesialis':
          const dokterSpesialis = responses['dokter_spesialis']
          return dokterSpesialis
        default:
            return "Dokter yang anda cari tidak ditemukan"
      }
    }else if (namaRS){
      switch(namaRS.toLowerCase()){
        case 'gladiool':
          const gladiool = responses['alamat_rs'].alamat
          return gladiool
      }
    }
    else {
      const selesai = responses['selesai'];
      return selesai[0];
    }
  }
}

module.exports = nlp
