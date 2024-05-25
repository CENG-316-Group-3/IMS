import React from 'react';
import '../styles/ApplicationForm.css';

function ApplicationForm() {
    return (
        <div className='application-form-container'>
            <h2>Application Form</h2>
            <div className='form-content'>
                <p>Name - Surname: </p>
                <p>Faculty: </p>
                <p>Department: </p>
                <p>Class: </p>
                <p>Student ID: </p>

                <p>
                    Yukarıda bilgileri verilen öğrencimizin mezun olabilmesi için Bölümümüz Lisans Eğitim Programında yer alan zorunlu stajını yapması gerekmektedir.
                    Öğrencimizin, Bölümümüzde almış olduğu teorik bilgilere ek olarak pratik bilgi ve becerisini geliştirmek amacıyla, uygun göreceğiniz tarihler arasında
                    <strong>en az 20 iş günü</strong> süre ile Kurumunuzda staj yapmasına izin verilmesi konusunda göstereceğiniz ilgiden ötürü şimdiden teşekkür ederim.
                    Öğrencimizin stajını Kurumunuzda yapmasını kabul etmeniz ve staj başlangıç ve bitiş tarihlerini, staja başlama tarihinden
                    <strong>en az 15 gün önce </strong>Bölüm Başkanlığımıza bildirmeniz halinde, stajyer öğrencimiz için, 5510 Sayılı “Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu”
                    gereği Sosyal Sigortalar Kurumu Sigortalı İşe Giriş Bildirgesi düzenlenecek ve
                    <strong>“İş Kazası ve Meslek Hastalıkları Sigorta Primi”</strong> Mühendislik Fakültesi Dekanlığı tarafından karşılanacaktır.
                </p>

                <div className="form-container">
                    <div className="table-section">
                        <table className="main-table">
                            <tbody>
                                <tr>
                                    <td colSpan="4" className="center bold">
                                        Bölüm Staj Koordinatörü Onayı
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="4" className="center">
                                        Buket ERŞAHİN
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="4" className="center">
                                        Tarih: .... / .... / 20...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="table-section">
                        <table className="main-table">
                            <thead>
                                <tr>
                                    <th>Kurum/Kuruluş/Firma Adı</th>
                                    <th>Adresi ve İrtibat Numarası</th>
                                    <th>Stajın Başlangıç Tarihi</th>
                                    <th>Stajın Bitiş Tarihi</th>
                                    <th>Staj Süresi (İş Günü)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>.... / .... / 20...</td>
                                    <td>.... / .... / 20...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="table-section">
                        <table className="main-table">
                            <thead>
                                <tr>
                                    <th>Adı Soyadı</th>
                                    <th>Görevi ve Unvanı</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>İşveren veya Yetkili Kişinin</td>
                                    <td></td>
                                    <td className="center">İmza, Kaşe ve Tarih</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="table-section">
                        <table className="info-table">
                            <tbody>
                                <tr>
                                    <td>Cumartesi günleri çalışıyor musunuz?</td>
                                    <td>
                                        <input type="radio" name="saturdayWork" value="yes" /> Evet
                                    </td>
                                    <td>
                                        <input type="radio" name="saturdayWork" value="no" /> Hayır
                                    </td>
                                </tr>
                                <tr>
                                    <td>Resmi-Dini Bayram/Tatil, Arefe Çalışıyor mu?</td>
                                    <td>
                                        <input type="radio" name="holidayWork" value="yes" /> Evet
                                    </td>
                                    <td>
                                        <input type="radio" name="holidayWork" value="no" /> Hayır
                                    </td>
                                    <td>
                                        Çalışıyorsa Gün sayısı <input type="number" name="workingDays" className="days-input" min={0} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Sigorta yapılmasını istemiyorum.</td>
                                    <td>
                                        <input type="radio" name="insurance" value="yes" /> Evet
                                    </td>
                                    <td>
                                        <input type="radio" name="insurance" value="no" /> Hayır
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicationForm;
