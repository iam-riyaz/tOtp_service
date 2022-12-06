
// import base32Encode from 'base32-encode'








const initalTime= Math.floor(Date.now()/1000)

const a1Function= ()=>{
    const currentCounter= Math.floor(Date.now()/1000)

    let result= Math.floor((currentCounter-initalTime)/30)


    // const data = new Uint8Array([initalTime,currentCounter])

    // const incodedBase32= base32Encode(data, 'Crockford')



    // console.log({incodedBase32})
 
    console.log({initalTime})
    console.log({currentCounter})
    console.log({result})
}