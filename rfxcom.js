var rfxcom = require('rfxcom'),
    restify = require('restify'),
    rfxtrx = new rfxcom.RfxCom("/dev/serial/by-id/usb-RFXCOM_RFXtrx433_A1RTH1H-if00-port0", {debug: true}),
    rfy = new rfxcom.Rfy(rfxtrx, rfxcom.rfy.RFY, {venetianBlindsMode: "EU"}),
    server = restify.createServer({
    name: 'rfy',
      version: '0.0.1'
    });

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const coverMapping = {
    'blind_one': '000001/2',
    'blind_two':'000001/3',
    'shutter': '000001/1'
}

server.get('/cover/:device/:option', function (req, res, next) {
  var deviceId = coverMapping[req.params.device];
  rfy.doCommand(deviceId, req.params.option);
  res.send(200);
  return next();
});

server.get('/program/:device/:code', function(req, res, next){
    console.log('programming device ', req.params.device, req.params.code);
    rfy.program(req.params.device + '/' + req.params.code);
    res.send(200);
    return next();
});

rfxtrx.initialise(function (error) {
  if (error) {
    throw new Error("Unable to initialise the rfx device");
  };
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});