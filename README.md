## yar-node

### ✨ Features:
- client[√]
- server[√]
- packager: json[√]、php[√]、msgpack[√]
- protocol: http[√]、tcp[×]、socket[×]

### Yar Header
```C
typedef struct _yar_header {
  unsigned int   id;            // transaction id
  unsigned short version;       // protocl version
  unsigned int   magic_num;     // default is: 0x80DFEC60
  unsigned int   reserved;
  unsigned char  provider[32];  // reqeust from who
  unsigned char  token[32];     // request token, used for authentication
  unsigned int   body_len;      // request body len
}
```

### Request
```javascript
{
  i: '', // transaction id
  m: '', // the method which being called
  p: {} // parameters
}
```

### Response
```javascript
{
  i: '', // transaction id
  s: '', // status
  r: '', // return value
  o: '', // output
  e: ''  // error or exception
}
```
