import React from 'react';
import classes from "./Clips.module.css";
import Clip from '../ui/clipUi/Clip';
import Carousel from './Carousel';
import Intro from '../ui/clipUi/Intro.js';

class Clips extends React.Component {
    constructor() {
        super();
        this.state = {
            clips: [],
            categories: [],
            searchField: '',
            value_list: [],
            items: [
                {
                  id: 0,
                  title: "Banana",
                  imageUrl: "https://images.agoramedia.com/everydayhealth/gcms/All-About-Bananas-Nutrition-Facts-Health-Benefits-Recipes-and-More-RM-722x406.jpg",
                  calories: 72,
                  duration: 100,
                  tags: ['Yellow','Potassium','Tropical'],
                  ageRestriction: 12,
                }, 
                {
                  id: 1, 
                  title: "Mango",
                  imageUrl: "https://i0.wp.com/bioplasticsnews.com/wp-content/uploads/2019/09/bioplastics-mango-kernel.png?resize=1024%2C576&ssl=1",
                  calories: 60,
                  duration: 147,
                  tags: ['Tasty','Colorful','Popular'],
                  ageRestriction: 14,
                }, 
                {
                  id: 2, 
                  title: "Apple",
                  imageUrl: "https://ichef.bbci.co.uk/wwfeatures/live/976_549/images/live/p0/7v/2w/p07v2wjn.jpg",
                  calories: 52,
                  duration: 89,
                  tags: ['Red','Popular','Also a brand'],
                  ageRestriction: 16,
                }, 
                {
                  id: 3, 
                  title: "Kiwi",
                  imageUrl: "https://ativosaude.akamaized.net/wp-content/uploads/2018/06/23103605/kiwi-fruta.jpg",
                  calories: 61,
                  duration: 124,
                  tags: ['Green','Different','Exotic'],
                  ageRestriction: 10,
                },
                {
                  id: 4, 
                  title: "Pineapple",
                  imageUrl: "https://s.yimg.com/ny/api/res/1.2/JFq5c46xXXBOoW9zqEnhiw--~A/YXBwaWQ9aGlnaGxhbmRlcjtzbT0xO3c9ODAw/https://media-mbst-pub-ue1.s3.amazonaws.com/creatr-uploaded-images/2019-10/5b495350-e613-11e9-bfdf-1e399de02304",
                  calories: 50,
                  duration: 111,
                  tags: ['Spiky','Leaf','Tropical'],
                  ageRestriction: 18,
                },
                {
                  id: 5, 
                  title: "Pear",
                  imageUrl: "https://englishlive.ef.com/pt-br/blog/wp-content/uploads/sites/16/2013/12/pear-pera-em-ingles.jpg",
                  calories: 57,
                  duration: 122,
                  tags: ['Yellowish','Greenish','Sweet'],
                  ageRestriction: 12,
                },
                {
                  id: 6, 
                  title: "Raspberry",
                  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Raspberries05.jpg/1200px-Raspberries05.jpg",
                  calories: 53,
                  duration: 95,
                  tags: ['Red','Edible','Berry'],
                  ageRestriction: 14,
                },
                {
                  id: 7, 
                  title: "Strawberry",
                  imageUrl: "https://mk0nationaltodayijln.kinstacdn.com/wp-content/uploads/2019/02/national-strawberry-month-640x514.jpg",
                  calories: 33,
                  duration: 104,
                  tags: ['Tasty','Berry','Red'],
                  ageRestriction: 18,
                },
                {
                  id: 8, 
                  title: "Coconut",
                  imageUrl: "https://images.agoramedia.com/everydayhealth/gcms/all-about-coconut-722x406.jpg",
                  calories: 283,
                  duration: 94,
                  tags: ['Palm trees','Tropical','Water'],
                  ageRestriction: 12,
                },
                {
                  id: 9, 
                  title: "Melon",
                  imageUrl: "https://media.gettyimages.com/photos/fresh-melon-picture-id480915274?b=1&k=6&m=480915274&s=612x612&w=0&h=-5OT2p1CIbdJYNdZrF-UMu7z7vrvvSEuTeZ_PTJzZx8=",
                  calories: 34,
                  duration: 73,
                  tags: ['Cantaloupe','Vitamin A','Sweet'],
                  ageRestriction: 10,
                },
                {
                  id: 10, 
                  title: "Watermelon",
                  imageUrl: "https://snaped.fns.usda.gov/sites/default/files/styles/crop_ratio_7_5/public/seasonal-produce/2018-05/watermelon.jpg?itok=6EdNOdUo",
                  calories: 30,
                  duration: 126,
                  tags: ['Hydration','Green','Red'],
                  ageRestriction: 18,
                },
                {
                  id: 11, 
                  title: "Orange",
                  imageUrl: "https://xzdl43v0mdf2m45tz2aj7kkv35-wpengine.netdna-ssl.com/wp-content/uploads/2010/10/orange-780x400.jpg",
                  calories: 47,
                  duration: 107,
                  tags: ['Vitamin C','Orange','Juice'],
                  ageRestriction: 14,
                },
              ]
        }
    }

    componentDidMount = () => {
        fetch('/portal/conf_info')
            .then((res) => res.json())
            .then((data) => {
                this.setState({ clips: data.clips })
                this.setState({ categories: data.categories })
            }
            )
    }


    render() {
        return (
            <div className={classes.clipscontainer + ' ' + classes['background' + Object.keys(this.state.categories).length] }>
              <Carousel />
              <Intro></Intro>
              <span id='clips_container'>
                {this.state.clips.map((clip, index) => (
                    <Clip
                        key={'clip-' + index}
                        title={clip.name}
                        color={this.state.categories[clip.category].color}
                        category={clip.category}
                        section={'section-' + clip.category}
                        clip_id={'clip' + index}
                        infotitle={clip.textcontext.title}
                        description={clip.textcontext.description}
                        highlights={clip.textcontext.highlights}
                        tot_categories={Object.keys(this.state.categories).length} ></Clip>
                ))}
              </span>
            </div>
        )
    }
}

export default Clips;