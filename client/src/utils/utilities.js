import $ from 'jquery';


export const newOpenModal = (callback) => {
    $('body').css('overflow', 'hidden');
    callback();
}

export const newOpenModal = (callback) => {
    $('body').css('overflow', 'auto');
    callback();
}