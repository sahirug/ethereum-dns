package ddns

import (
	"errors"
	"golang.org/x/net/dns/dnsmessage"
	"log"
	"net"
)

type DDNServer interface {
	Listen()
	Query(Packet)
}

type DDNService struct {
	conn *net.UDPConn
}

type Packet struct {
	addr net.UDPAddr
	message dnsmessage.Message
}

const (
	udpPort int = 53 // the default port for dns server
	packetLen int = 512 // the max packet length
)

var (
	errTypeNotSupported = errors.New("type not supported")
	errIpInvalid = errors.New("invalid Ip address")
)

func (s *DDNService) Listen() {
	var err error
	s.conn, err = net.ListenUDP("udp", &net.UDPAddr{Port:udpPort})
	if err != nil {
		log.Fatal("fatal err ===>", err)
	}

	defer s.conn.Close()

	log.Println(" == started listening ==")

	for {
		buf := make([]byte, packetLen)
		_, addr, err := s.conn.ReadFromUDP(buf)

		if err!= nil {
			log.Println("non fatal err ===>", err)
			continue
		}

		var m dnsmessage.Message

		err = m.Unpack(buf)

		if err != nil {
			log.Println("non fatal err ===>", err)
			continue
		}

		if len(m.Questions) == 0 {
			log.Println("=== no questions found ===")
			continue
		}

		go s.Query(Packet{*addr, m})
	}
}

func (s *DDNService) Query(p Packet) {
	if p.message.Header.Response {
		//pKey := pString
	}
	log.Println("query method")
	log.Println(p.message.Questions[0].Name)
}

func New() DDNService {
	return DDNService{}
}

func Start() *DDNService {
	log.Println("== start method ==")
	s := New()
	s.Listen()

	return &s
}